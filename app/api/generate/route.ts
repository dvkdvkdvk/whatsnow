import { generateText } from 'ai'
import { type DesignTokens } from '@/lib/store'

export async function POST(req: Request) {
  const { prompt, type, tokens, style, cssContent, screenshotUrl } = await req.json() as {
    prompt: string
    type: 'component' | 'section' | 'page'
    tokens: DesignTokens
    style: 'editorial' | 'action' | 'minimalist'
    cssContent?: string
    screenshotUrl?: string  // Visual reference image
  }

  // ============================================================
  // STEP 1: Extract colors from tokens
  // ============================================================
  const colorsByName = new Map<string, string>()
  const allColors: string[] = []
  
  const colors = tokens.colors || {}
  for (const [key, value] of Object.entries(colors)) {
    if (value && typeof value === 'string' && !value.startsWith('var(')) {
      allColors.push(value)
      const k = key.toLowerCase()
      if ((k === 'primary' || k.includes('primary') || k.includes('accent')) && !colorsByName.has('primary')) {
        colorsByName.set('primary', value)
      }
      if ((k === 'background' || k.includes('background')) && !k.includes('foreground') && !colorsByName.has('background')) {
        colorsByName.set('background', value)
      }
      if ((k === 'foreground' || k.includes('foreground') || k === 'text') && !colorsByName.has('foreground')) {
        colorsByName.set('foreground', value)
      }
      if ((k.includes('muted') || k.includes('secondary')) && !colorsByName.has('muted')) {
        colorsByName.set('muted', value)
      }
    }
  }
  
  // Also extract from cssContent
  if (cssContent) {
    const varRegex = /--([a-zA-Z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/gi
    let match
    while ((match = varRegex.exec(cssContent)) !== null) {
      const key = match[1].toLowerCase()
      const value = match[2]
      allColors.push(value)
      if ((key.includes('primary') || key.includes('accent')) && !colorsByName.has('primary')) {
        colorsByName.set('primary', value)
      } else if (key.includes('background') && !key.includes('foreground') && !colorsByName.has('background')) {
        colorsByName.set('background', value)
      } else if ((key.includes('foreground') || key === 'text') && !colorsByName.has('foreground')) {
        colorsByName.set('foreground', value)
      }
    }
  }

  // ============================================================
  // STEP 2: Analyze colors
  // ============================================================
  const parseHex = (hex: string): { r: number; g: number; b: number } | null => {
    const c = hex.toLowerCase().replace(/\s/g, '')
    if (!c.startsWith('#')) return null
    const h = c.slice(1)
    if (h.length === 3) {
      return { r: parseInt(h[0] + h[0], 16), g: parseInt(h[1] + h[1], 16), b: parseInt(h[2] + h[2], 16) }
    } else if (h.length >= 6) {
      return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
    }
    return null
  }
  
  const getBrightness = (color: string): number => {
    const rgb = parseHex(color)
    return rgb ? (rgb.r + rgb.g + rgb.b) / 3 : 128
  }
  
  const isGrayscale = (color: string): boolean => {
    const rgb = parseHex(color)
    if (!rgb) return false
    return Math.max(Math.abs(rgb.r - rgb.g), Math.abs(rgb.g - rgb.b), Math.abs(rgb.r - rgb.b)) < 25
  }

  const darkGrays = allColors.filter(c => isGrayscale(c) && getBrightness(c) < 80)
  const lightGrays = allColors.filter(c => isGrayscale(c) && getBrightness(c) > 200)
  const midGrays = allColors.filter(c => isGrayscale(c) && getBrightness(c) >= 80 && getBrightness(c) <= 200)
  const accents = allColors.filter(c => !isGrayscale(c))

  const explicitBg = colorsByName.get('background')
  const isDarkTheme = explicitBg ? getBrightness(explicitBg) < 100 : darkGrays.length > lightGrays.length

  // ============================================================
  // STEP 3: Determine final colors
  // ============================================================
  const bg = colorsByName.get('background') || (isDarkTheme ? darkGrays[0] : lightGrays[0]) || '#0a0a0a'
  const fg = colorsByName.get('foreground') || (isDarkTheme ? lightGrays[0] : darkGrays[0]) || '#ffffff'
  const primary = colorsByName.get('primary') || accents[0] || '#E6FF2A'
  const primaryFg = getBrightness(primary) > 128 ? '#000000' : '#ffffff'
  const muted = colorsByName.get('muted') || midGrays[0] || '#888888'
  const card = isDarkTheme ? '#1a1a1a' : '#f5f5f5'
  const border = isDarkTheme ? '#333333' : '#e5e5e5'



  const typography = tokens.typography || {}
  const fontSans = typography['font-family'] || typography['font-sans'] || 'system-ui, -apple-system, sans-serif'
  const borderRadius = Object.values(tokens.borderRadius || {})[0] || '8px'

  // ============================================================
  // STEP 4: Generate using VISUAL reference if available
  // ============================================================
  
  // Build the system prompt - includes visual matching if screenshot exists
  const systemPrompt = screenshotUrl 
    ? `You are a UI component generator that PERFECTLY matches the visual style of the reference image.

CRITICAL: Analyze the reference image and extract:
1. EXACT colors (background, text, accent/primary colors)
2. Typography style (font weights, sizes, line heights)
3. Spacing patterns (padding, margins, gaps)
4. Border radius styles
5. Overall visual aesthetic (dark/light theme, minimal/bold)

Then generate HTML that VISUALLY MATCHES the reference image's style.

USE THESE CLASS NAMES:
- .brand-section - main wrapper (use the image's background color)
- .brand-container - max-width container
- .brand-heading - for h1, h2, h3 (match the image's heading style)
- .brand-text - for paragraphs (match the image's text color)
- .brand-muted - for secondary text
- .brand-button - for buttons (match the image's button style EXACTLY)
- .brand-link - for text links (match the image's link/accent color)
- .brand-card - for card backgrounds

STRUCTURE:
<section class="brand-section">
  <div class="brand-container">
    <h2 class="brand-heading">Title</h2>
    <p class="brand-text">Description</p>
    <button class="brand-button">CTA</button>
  </div>
</section>

RULES:
1. MATCH the visual style from the reference image
2. Use ONLY the brand-* classes above  
3. NO inline style attributes
4. NO Tailwind classes for colors
5. You CAN use Tailwind for layout: flex, grid, gap-*, p-*, m-*, w-*, etc
6. Output RAW HTML only - no markdown, no code blocks`
    : `You are a UI component generator. Generate HTML that uses CSS classes, NOT inline styles.

USE THESE CLASS NAMES:
- .brand-section - main wrapper
- .brand-container - max-width container
- .brand-heading - for h1, h2, h3
- .brand-text - for paragraphs
- .brand-muted - for secondary text
- .brand-button - for buttons and CTA links
- .brand-link - for text links
- .brand-card - for card backgrounds

STRUCTURE:
<section class="brand-section">
  <div class="brand-container">
    <h2 class="brand-heading">Title</h2>
    <p class="brand-text">Description</p>
    <button class="brand-button">CTA</button>
  </div>
</section>

RULES:
1. Use ONLY the brand-* classes above
2. NO inline style attributes
3. NO Tailwind classes for colors (bg-*, text-*, etc)
4. You CAN use Tailwind for layout: flex, grid, gap-*, p-*, m-*, w-*, etc
5. Keep responsive - use flex-wrap, percentage widths
6. Output RAW HTML only - no markdown, no code blocks`

  const userPrompt = `Create a ${type}: ${prompt}

Style variant: ${style}
- editorial: generous whitespace, elegant typography, sophisticated feel
- action: bold CTAs, prominent buttons, high contrast, energetic
- minimalist: clean lines, maximum simplicity, essential elements only

BRAND COLORS TO USE:
- Background: ${bg}
- Text/Foreground: ${fg}
- Primary/Accent: ${primary}
- Muted text: ${muted}
- Card background: ${card}
- Border: ${border}`

  try {
    // Use multimodal generation if we have a screenshot
    const messages: Array<{ role: 'user'; content: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> }> = [
      {
        role: 'user',
        content: screenshotUrl 
          ? [
              { type: 'image', image: screenshotUrl },
              { type: 'text', text: userPrompt }
            ]
          : [
              { type: 'text', text: userPrompt }
            ]
      }
    ]

    const result = await generateText({
      model: 'anthropic/claude-sonnet-4-20250514',
      system: systemPrompt,
      messages,
      maxOutputTokens: 4000,
    })

    let html = result.text.trim()
      .replace(/^```html?\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim()

    // ============================================================
    // STEP 5: Build the brand CSS that defines all the classes
    // ============================================================
    const brandCSS = `
<style>
  /* FORCE BRAND COLORS - Global overrides */
  * {
    box-sizing: border-box;
  }
  
  html, body {
    background-color: ${bg} !important;
    color: ${fg} !important;
    margin: 0;
    padding: 0;
  }
  
  /* Brand Design System Classes */
  .brand-section {
    background-color: ${bg} !important;
    color: ${fg} !important;
    min-height: 100vh;
    padding: 3rem 1.5rem;
    font-family: ${fontSans} !important;
  }
  
  .brand-container {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  
  .brand-heading {
    color: ${fg} !important;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: ${fg} !important;
    font-weight: 700 !important;
  }
  
  .brand-text, p {
    color: ${fg} !important;
    line-height: 1.6;
    margin-bottom: 1rem;
  }
  
  .brand-muted {
    color: ${muted} !important;
    line-height: 1.6;
  }
  
  .brand-button, button, [type="button"], [type="submit"], a[role="button"] {
    background-color: ${primary} !important;
    color: ${primaryFg} !important;
    padding: 0.75rem 1.5rem !important;
    border: none !important;
    border-radius: ${borderRadius} !important;
    font-weight: 600 !important;
    cursor: pointer;
    display: inline-block;
    text-decoration: none !important;
    text-align: center;
    transition: opacity 0.2s;
  }
  
  .brand-button:hover, button:hover {
    opacity: 0.9;
  }
  
  .brand-link, a {
    color: ${primary} !important;
    text-decoration: none;
  }
  
  .brand-link:hover, a:hover {
    text-decoration: underline;
  }
  
  .brand-card {
    background-color: ${card} !important;
    border: 1px solid ${border} !important;
    border-radius: ${borderRadius};
    padding: 1.5rem;
  }
  
  /* Remove any background colors that aren't brand colors */
  div, section, article, main, header, footer {
    background-color: inherit !important;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .brand-section { padding: 2rem 1rem !important; }
    h1 { font-size: 2rem !important; }
    h2 { font-size: 1.75rem !important; }
    h3 { font-size: 1.25rem !important; }
  }
</style>`

    // Ensure the HTML has a wrapper with brand-section class
    if (!html.includes('brand-section')) {
      html = `<section class="brand-section"><div class="brand-container">${html}</div></section>`
    }

    // Prepend the brand CSS
    html = brandCSS + html
    
    return Response.json({ html })
    
  } catch (error) {
    console.error('Generation error:', error)
    // Return a properly branded fallback
    const fallbackHTML = `
<style>
  .brand-section { background-color: ${bg}; color: ${fg}; min-height: 100vh; padding: 3rem 1.5rem; font-family: ${fontSans}; display: flex; align-items: center; justify-content: center; text-align: center; }
  .brand-heading { color: ${fg}; margin-bottom: 1rem; font-size: 2rem; }
  .brand-text { color: ${muted}; margin-bottom: 2rem; }
  .brand-button { background-color: ${primary}; color: ${primaryFg}; padding: 0.75rem 1.5rem; border: none; border-radius: ${borderRadius}; cursor: pointer; }
</style>
<section class="brand-section">
  <div>
    <h2 class="brand-heading">${prompt}</h2>
    <p class="brand-text">Generated content placeholder</p>
    <button class="brand-button">Get Started</button>
  </div>
</section>`
    return Response.json({ html: fallbackHTML })
  }
}
