import type { GeneratedVariant, DesignTokens } from './store'

/**
 * Generate native SVG with proper elements that Figma recognizes
 * as Fills, Strokes, Text layers, etc.
 */
function generateNativeSVG(
  variant: GeneratedVariant,
  tokens: DesignTokens,
  width: number = 1440,
  height: number = 900
): string {
  const bgColor = tokens.colors?.background || '#ffffff'
  const fgColor = tokens.colors?.foreground || '#0a0a0a'
  const mutedColor = tokens.colors?.muted || '#737373'
  const primaryColor = tokens.colors?.primary || '#0a0a0a'
  const primaryFgColor = tokens.colors?.['primary-foreground'] || '#ffffff'
  const borderColor = tokens.colors?.border || '#e5e5e5'
  const cardColor = tokens.colors?.card || '#f5f5f5'

  const elements: string[] = []
  const sectionType = variant.sectionType
  const style = variant.style

  // Background frame
  elements.push(`  <rect id="Background" x="0" y="0" width="${width}" height="${height}" fill="${bgColor}"/>`)

  // Generate section-specific elements
  if (sectionType === 'navbar') {
    elements.push(...generateNavbarSVG(style, width, fgColor, borderColor, primaryColor, primaryFgColor, bgColor))
  }
  
  if (sectionType === 'hero') {
    elements.push(...generateHeroSVG(style, width, height, fgColor, mutedColor, primaryColor, primaryFgColor, borderColor, cardColor))
  }
  
  if (sectionType === 'features') {
    elements.push(...generateFeaturesSVG(style, width, fgColor, mutedColor, primaryColor, borderColor, cardColor))
  }
  
  if (sectionType === 'pricing') {
    elements.push(...generatePricingSVG(style, width, fgColor, mutedColor, primaryColor, primaryFgColor, borderColor, cardColor))
  }
  
  if (sectionType === 'testimonials') {
    elements.push(...generateTestimonialsSVG(style, width, fgColor, mutedColor, primaryColor, borderColor, cardColor, bgColor))
  }
  
  if (sectionType === 'footer') {
    elements.push(...generateFooterSVG(style, width, height, fgColor, mutedColor, primaryColor, primaryFgColor, borderColor, cardColor, bgColor))
  }
  
  if (sectionType === 'contact') {
    elements.push(...generateContactSVG(style, width, fgColor, mutedColor, primaryColor, primaryFgColor, borderColor, cardColor, bgColor))
  }
  
  if (sectionType === 'faq') {
    elements.push(...generateFAQSVG(style, width, fgColor, mutedColor, primaryColor, borderColor, cardColor))
  }
  
  if (sectionType === 'cta') {
    elements.push(...generateCTASVG(style, width, fgColor, mutedColor, primaryColor, primaryFgColor, borderColor, cardColor))
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <style>
      text { font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    </style>
  </defs>
  <g id="${variant.name.replace(/\s+/g, '-')}">
${elements.join('\n')}
  </g>
</svg>`
}

function generateNavbarSVG(
  style: string,
  width: number,
  fgColor: string,
  borderColor: string,
  primaryColor: string,
  primaryFgColor: string,
  bgColor: string
): string[] {
  const els: string[] = []
  
  els.push(`    <g id="Navbar">`)
  els.push(`      <rect id="Navbar-Background" x="0" y="0" width="${width}" height="72" fill="${bgColor}"/>`)
  els.push(`      <rect id="Navbar-Border" x="0" y="71" width="${width}" height="1" fill="${borderColor}"/>`)
  els.push(`      <text id="Logo" x="48" y="42" fill="${fgColor}" font-size="20" font-weight="600">BRAND</text>`)
  
  // Nav items
  els.push(`      <g id="Nav-Links">`)
  ;['Features', 'Pricing', 'About'].forEach((item, i) => {
    els.push(`        <text id="Nav-${item}" x="${580 + i * 100}" y="42" fill="${fgColor}" font-size="14" font-weight="500">${item}</text>`)
  })
  els.push(`      </g>`)
  
  if (style === 'action') {
    els.push(`      <g id="CTA-Button">`)
    els.push(`        <rect id="CTA-Button-Fill" x="${width - 180}" y="20" width="132" height="40" rx="8" fill="${primaryColor}"/>`)
    els.push(`        <text id="CTA-Button-Text" x="${width - 114}" y="46" fill="${primaryFgColor}" font-size="14" font-weight="600" text-anchor="middle">Get Started</text>`)
    els.push(`      </g>`)
  }
  
  els.push(`    </g>`)
  return els
}

function generateHeroSVG(
  style: string,
  width: number,
  height: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  primaryFgColor: string,
  borderColor: string,
  cardColor: string
): string[] {
  const els: string[] = []
  const yBase = 150
  
  els.push(`    <g id="Hero-Section">`)
  
  if (style === 'editorial') {
    els.push(`      <text id="Hero-Label" x="${width / 2}" y="${yBase}" fill="${mutedColor}" font-size="12" font-weight="500" text-anchor="middle" letter-spacing="4">FEATURED</text>`)
    els.push(`      <text id="Hero-Title" x="${width / 2}" y="${yBase + 100}" fill="${fgColor}" font-size="64" font-weight="300" text-anchor="middle">Your Headline Here</text>`)
    els.push(`      <text id="Hero-Subtitle" x="${width / 2}" y="${yBase + 160}" fill="${mutedColor}" font-size="22" font-weight="300" text-anchor="middle">Discover the story behind the vision. A curated experience.</text>`)
  } else if (style === 'action') {
    els.push(`      <text id="Hero-Title-Line1" x="80" y="${yBase + 50}" fill="${fgColor}" font-size="52" font-weight="700">Hero Section</text>`)
    els.push(`      <text id="Hero-Title-Line2" x="80" y="${yBase + 110}" fill="${fgColor}" font-size="52" font-weight="700">Headline Here</text>`)
    els.push(`      <text id="Hero-Subtitle" x="80" y="${yBase + 170}" fill="${mutedColor}" font-size="18" font-weight="400">Take action today. Transform your business with cutting-edge solutions.</text>`)
    
    // Primary Button
    els.push(`      <g id="Primary-Button">`)
    els.push(`        <rect id="Primary-Button-Fill" x="80" y="${yBase + 210}" width="160" height="52" rx="8" fill="${primaryColor}"/>`)
    els.push(`        <text id="Primary-Button-Text" x="160" y="${yBase + 242}" fill="${primaryFgColor}" font-size="16" font-weight="600" text-anchor="middle">Get Started</text>`)
    els.push(`      </g>`)
    
    // Secondary Button
    els.push(`      <g id="Secondary-Button">`)
    els.push(`        <rect id="Secondary-Button-Stroke" x="260" y="${yBase + 210}" width="140" height="52" rx="8" fill="none" stroke="${borderColor}" stroke-width="2"/>`)
    els.push(`        <text id="Secondary-Button-Text" x="330" y="${yBase + 242}" fill="${fgColor}" font-size="16" font-weight="600" text-anchor="middle">Learn More</text>`)
    els.push(`      </g>`)
    
    // Preview Card
    els.push(`      <g id="Preview-Card">`)
    els.push(`        <rect id="Preview-Card-Fill" x="${width - 500}" y="${yBase - 30}" width="400" height="350" rx="16" fill="${cardColor}"/>`)
    els.push(`        <text id="Preview-Card-Label" x="${width - 300}" y="${yBase + 150}" fill="${mutedColor}" font-size="14" text-anchor="middle">Preview Area</text>`)
    els.push(`      </g>`)
  } else {
    // Minimalist
    els.push(`      <text id="Hero-Title" x="80" y="${height / 2 - 40}" fill="${fgColor}" font-size="44" font-weight="300">Your Headline Here</text>`)
    els.push(`      <g id="Explore-Link">`)
    els.push(`        <text id="Explore-Text" x="80" y="${height / 2 + 60}" fill="${fgColor}" font-size="13" font-weight="500" letter-spacing="2">EXPLORE</text>`)
    els.push(`        <text id="Explore-Arrow" x="155" y="${height / 2 + 60}" fill="${fgColor}" font-size="13">→</text>`)
    els.push(`      </g>`)
    els.push(`      <rect id="Divider-Line" x="200" y="${height / 2 + 52}" width="${width - 280}" height="1" fill="${borderColor}"/>`)
  }
  
  els.push(`    </g>`)
  return els
}

function generateFeaturesSVG(
  style: string,
  width: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  borderColor: string,
  cardColor: string
): string[] {
  const els: string[] = []
  const yBase = 120
  
  els.push(`    <g id="Features-Section">`)
  
  if (style === 'editorial') {
    els.push(`      <text id="Features-Label" x="80" y="${yBase}" fill="${mutedColor}" font-size="12" font-weight="500" letter-spacing="4">CAPABILITIES</text>`)
    els.push(`      <text id="Features-Title" x="80" y="${yBase + 50}" fill="${fgColor}" font-size="44" font-weight="300">What We Offer</text>`)
    
    // Feature Cards
    for (let i = 0; i < 3; i++) {
      const x = 80 + i * 427
      els.push(`      <g id="Feature-Card-${i + 1}">`)
      els.push(`        <rect id="Feature-Card-${i + 1}-Stroke" x="${x}" y="${yBase + 100}" width="407" height="260" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
      els.push(`        <text id="Feature-Number-${i + 1}" x="${x + 32}" y="${yBase + 180}" fill="${borderColor}" font-size="56" font-weight="300">0${i + 1}</text>`)
      els.push(`        <text id="Feature-Title-${i + 1}" x="${x + 32}" y="${yBase + 250}" fill="${fgColor}" font-size="18" font-weight="500">Feature ${i + 1}</text>`)
      els.push(`        <text id="Feature-Desc-${i + 1}" x="${x + 32}" y="${yBase + 285}" fill="${mutedColor}" font-size="14">A comprehensive solution designed</text>`)
      els.push(`        <text id="Feature-Desc-${i + 1}-L2" x="${x + 32}" y="${yBase + 305}" fill="${mutedColor}" font-size="14">to elevate your experience.</text>`)
      els.push(`      </g>`)
    }
  } else if (style === 'action') {
    els.push(`      <text id="Features-Title" x="${width / 2}" y="${yBase}" fill="${fgColor}" font-size="36" font-weight="700" text-anchor="middle">Powerful Features</text>`)
    els.push(`      <text id="Features-Subtitle" x="${width / 2}" y="${yBase + 40}" fill="${mutedColor}" font-size="18" text-anchor="middle">Everything you need to succeed</text>`)
    
    for (let i = 0; i < 3; i++) {
      const x = 80 + i * 427
      els.push(`      <g id="Feature-Card-${i + 1}">`)
      els.push(`        <rect id="Feature-Card-${i + 1}-Fill" x="${x}" y="${yBase + 90}" width="407" height="230" rx="12" fill="${cardColor}"/>`)
      els.push(`        <rect id="Feature-Card-${i + 1}-Stroke" x="${x}" y="${yBase + 90}" width="407" height="230" rx="12" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
      els.push(`        <rect id="Feature-Icon-${i + 1}" x="${x + 24}" y="${yBase + 114}" width="48" height="48" rx="8" fill="${primaryColor}" fill-opacity="0.15"/>`)
      els.push(`        <text id="Feature-Title-${i + 1}" x="${x + 24}" y="${yBase + 210}" fill="${fgColor}" font-size="18" font-weight="600">Feature ${i + 1}</text>`)
      els.push(`        <text id="Feature-Desc-${i + 1}" x="${x + 24}" y="${yBase + 245}" fill="${mutedColor}" font-size="14">Streamline your workflow with</text>`)
      els.push(`        <text id="Feature-Desc-${i + 1}-L2" x="${x + 24}" y="${yBase + 265}" fill="${mutedColor}" font-size="14">powerful automation tools.</text>`)
      els.push(`        <text id="Feature-Link-${i + 1}" x="${x + 24}" y="${yBase + 300}" fill="${primaryColor}" font-size="14" font-weight="500">Learn more →</text>`)
      els.push(`      </g>`)
    }
  } else {
    // Minimalist
    for (let i = 0; i < 4; i++) {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = 80 + col * 660
      const y = yBase + row * 150
      els.push(`      <g id="Feature-${i + 1}">`)
      els.push(`        <rect id="Feature-Divider-${i + 1}" x="${x}" y="${y + 80}" width="580" height="1" fill="${borderColor}"/>`)
      els.push(`        <text id="Feature-Title-${i + 1}" x="${x}" y="${y + 30}" fill="${fgColor}" font-size="18" font-weight="500">Feature ${i + 1}</text>`)
      els.push(`        <text id="Feature-Desc-${i + 1}" x="${x}" y="${y + 58}" fill="${mutedColor}" font-size="14">Simplicity meets functionality. Designed for clarity.</text>`)
      els.push(`      </g>`)
    }
  }
  
  els.push(`    </g>`)
  return els
}

function generatePricingSVG(
  style: string,
  width: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  primaryFgColor: string,
  borderColor: string,
  cardColor: string
): string[] {
  const els: string[] = []
  const yBase = 100
  
  els.push(`    <g id="Pricing-Section">`)
  
  if (style === 'action') {
    els.push(`      <text id="Pricing-Title" x="${width / 2}" y="${yBase}" fill="${fgColor}" font-size="36" font-weight="700" text-anchor="middle">Simple Pricing</text>`)
    els.push(`      <text id="Pricing-Subtitle" x="${width / 2}" y="${yBase + 40}" fill="${mutedColor}" font-size="18" text-anchor="middle">No hidden fees. Cancel anytime.</text>`)
    
    const plans = [
      { name: 'Starter', price: '$29', popular: false },
      { name: 'Pro', price: '$79', popular: true },
      { name: 'Enterprise', price: '$199', popular: false },
    ]
    
    plans.forEach((plan, i) => {
      const x = 80 + i * 427
      const strokeCol = plan.popular ? primaryColor : borderColor
      const strokeW = plan.popular ? 2 : 1
      
      els.push(`      <g id="Pricing-Card-${plan.name}">`)
      els.push(`        <rect id="Card-${plan.name}-Fill" x="${x}" y="${yBase + 90}" width="407" height="360" rx="12" fill="${cardColor}"/>`)
      els.push(`        <rect id="Card-${plan.name}-Stroke" x="${x}" y="${yBase + 90}" width="407" height="360" rx="12" fill="none" stroke="${strokeCol}" stroke-width="${strokeW}"/>`)
      
      if (plan.popular) {
        els.push(`        <rect id="Popular-Badge-Fill" x="${x + 24}" y="${yBase + 114}" width="65" height="24" rx="12" fill="${primaryColor}"/>`)
        els.push(`        <text id="Popular-Badge-Text" x="${x + 56}" y="${yBase + 131}" fill="${primaryFgColor}" font-size="11" font-weight="600" text-anchor="middle">Popular</text>`)
      }
      
      const titleY = plan.popular ? yBase + 175 : yBase + 150
      els.push(`        <text id="${plan.name}-Name" x="${x + 24}" y="${titleY}" fill="${fgColor}" font-size="20" font-weight="600">${plan.name}</text>`)
      els.push(`        <text id="${plan.name}-Price" x="${x + 24}" y="${titleY + 50}" fill="${fgColor}" font-size="40" font-weight="700">${plan.price}</text>`)
      els.push(`        <text id="${plan.name}-Period" x="${x + 110}" y="${titleY + 50}" fill="${mutedColor}" font-size="16">/mo</text>`)
      
      // Features
      for (let j = 0; j < 3; j++) {
        els.push(`        <text id="${plan.name}-Feature-${j + 1}" x="${x + 44}" y="${titleY + 100 + j * 28}" fill="${mutedColor}" font-size="14">✓ Feature included</text>`)
      }
      
      // Button
      const btnFill = plan.popular ? primaryColor : 'none'
      const btnTextFill = plan.popular ? primaryFgColor : fgColor
      els.push(`        <rect id="${plan.name}-Button-Fill" x="${x + 24}" y="${yBase + 390}" width="359" height="44" rx="8" fill="${btnFill}" stroke="${borderColor}" stroke-width="1"/>`)
      els.push(`        <text id="${plan.name}-Button-Text" x="${x + 203}" y="${yBase + 418}" fill="${btnTextFill}" font-size="15" font-weight="600" text-anchor="middle">Get Started</text>`)
      els.push(`      </g>`)
    })
  } else if (style === 'editorial') {
    els.push(`      <text id="Pricing-Label" x="${width / 2}" y="${yBase}" fill="${mutedColor}" font-size="12" font-weight="500" text-anchor="middle" letter-spacing="4">INVESTMENT</text>`)
    els.push(`      <text id="Pricing-Title" x="${width / 2}" y="${yBase + 50}" fill="${fgColor}" font-size="44" font-weight="300" text-anchor="middle">Choose Your Path</text>`)
    
    const plans = [{ name: 'Essential', price: '$99' }, { name: 'Premium', price: '$299' }]
    plans.forEach((plan, i) => {
      const x = 80 + i * 660
      els.push(`      <g id="Pricing-Card-${plan.name}">`)
      els.push(`        <rect id="Card-${plan.name}-Stroke" x="${x}" y="${yBase + 100}" width="640" height="320" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
      els.push(`        <text id="${plan.name}-Label" x="${x + 40}" y="${yBase + 155}" fill="${mutedColor}" font-size="12" font-weight="500" letter-spacing="3">${plan.name.toUpperCase()}</text>`)
      els.push(`        <text id="${plan.name}-Price" x="${x + 40}" y="${yBase + 220}" fill="${fgColor}" font-size="44" font-weight="300">${plan.price}</text>`)
      els.push(`        <text id="${plan.name}-Period" x="${x + 165}" y="${yBase + 220}" fill="${mutedColor}" font-size="14">/month</text>`)
      
      for (let j = 0; j < 3; j++) {
        els.push(`        <text id="${plan.name}-Feature-${j + 1}" x="${x + 40}" y="${yBase + 270 + j * 28}" fill="${mutedColor}" font-size="14">— Feature ${j + 1}</text>`)
      }
      
      els.push(`        <rect id="${plan.name}-Button-Stroke" x="${x + 40}" y="${yBase + 365}" width="560" height="40" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
      els.push(`        <text id="${plan.name}-Button-Text" x="${x + 320}" y="${yBase + 391}" fill="${fgColor}" font-size="12" font-weight="500" text-anchor="middle" letter-spacing="2">SELECT</text>`)
      els.push(`      </g>`)
    })
  } else {
    // Minimalist
    els.push(`      <text id="Pricing-Title" x="80" y="${yBase + 40}" fill="${fgColor}" font-size="30" font-weight="300">Pricing</text>`)
    
    const plans = [
      { name: 'Basic', desc: 'For individuals', price: '$19' },
      { name: 'Standard', desc: 'For teams', price: '$49' },
      { name: 'Premium', desc: 'For enterprises', price: '$99' },
    ]
    plans.forEach((plan, i) => {
      const y = yBase + 100 + i * 100
      els.push(`      <g id="Plan-${plan.name}">`)
      els.push(`        <rect id="${plan.name}-Divider" x="80" y="${y + 55}" width="${width - 160}" height="1" fill="${borderColor}"/>`)
      els.push(`        <text id="${plan.name}-Name" x="80" y="${y + 20}" fill="${fgColor}" font-size="18" font-weight="500">${plan.name}</text>`)
      els.push(`        <text id="${plan.name}-Desc" x="80" y="${y + 42}" fill="${mutedColor}" font-size="14">${plan.desc}</text>`)
      els.push(`        <text id="${plan.name}-Price" x="${width - 80}" y="${y + 25}" fill="${fgColor}" font-size="24" font-weight="300" text-anchor="end">${plan.price}</text>`)
      els.push(`        <text id="${plan.name}-Period" x="${width - 80}" y="${y + 45}" fill="${mutedColor}" font-size="14" text-anchor="end">/mo</text>`)
      els.push(`      </g>`)
    })
  }
  
  els.push(`    </g>`)
  return els
}

function generateTestimonialsSVG(
  style: string,
  width: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  borderColor: string,
  cardColor: string,
  bgColor: string
): string[] {
  const els: string[] = []
  const yBase = 150
  
  els.push(`    <g id="Testimonials-Section">`)
  
  if (style === 'editorial') {
    els.push(`      <text id="Quote-Mark" x="80" y="${yBase}" fill="${borderColor}" font-size="100" font-family="Georgia, serif">"</text>`)
    els.push(`      <text id="Testimonial-Line1" x="${width / 2}" y="${yBase + 80}" fill="${fgColor}" font-size="30" font-weight="300" text-anchor="middle">An exceptional experience that</text>`)
    els.push(`      <text id="Testimonial-Line2" x="${width / 2}" y="${yBase + 120}" fill="${fgColor}" font-size="30" font-weight="300" text-anchor="middle">transformed the way we work.</text>`)
    els.push(`      <text id="Author-Name" x="${width / 2}" y="${yBase + 200}" fill="${fgColor}" font-size="16" font-weight="500" text-anchor="middle">Jane Smith</text>`)
    els.push(`      <text id="Author-Role" x="${width / 2}" y="${yBase + 225}" fill="${mutedColor}" font-size="14" text-anchor="middle">CEO, Company Name</text>`)
  } else if (style === 'action') {
    els.push(`      <rect id="Section-Background" x="0" y="0" width="${width}" height="600" fill="${cardColor}"/>`)
    els.push(`      <text id="Section-Title" x="${width / 2}" y="80" fill="${fgColor}" font-size="36" font-weight="700" text-anchor="middle">Loved by Teams</text>`)
    els.push(`      <text id="Section-Subtitle" x="${width / 2}" y="115" fill="${mutedColor}" font-size="18" text-anchor="middle">See what our customers have to say</text>`)
    
    for (let i = 0; i < 3; i++) {
      const x = 80 + i * 427
      els.push(`      <g id="Testimonial-Card-${i + 1}">`)
      els.push(`        <rect id="Card-${i + 1}-Fill" x="${x}" y="160" width="407" height="200" rx="12" fill="${bgColor}"/>`)
      els.push(`        <rect id="Card-${i + 1}-Stroke" x="${x}" y="160" width="407" height="200" rx="12" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
      els.push(`        <text id="Stars-${i + 1}" x="${x + 24}" y="200" fill="${primaryColor}" font-size="16">★★★★★</text>`)
      els.push(`        <text id="Quote-${i + 1}-L1" x="${x + 24}" y="240" fill="${mutedColor}" font-size="14">"Amazing product. Has completely</text>`)
      els.push(`        <text id="Quote-${i + 1}-L2" x="${x + 24}" y="260" fill="${mutedColor}" font-size="14">changed how we work."</text>`)
      els.push(`        <circle id="Avatar-${i + 1}" cx="${x + 44}" cy="315" r="18" fill="${borderColor}"/>`)
      els.push(`        <text id="User-Name-${i + 1}" x="${x + 74}" y="310" fill="${fgColor}" font-size="14" font-weight="500">User Name</text>`)
      els.push(`        <text id="User-Role-${i + 1}" x="${x + 74}" y="328" fill="${mutedColor}" font-size="12">Role, Company</text>`)
      els.push(`      </g>`)
    }
  } else {
    // Minimalist
    els.push(`      <text id="Quote-Line1" x="80" y="${yBase}" fill="${fgColor}" font-size="26" font-weight="300">"Simple, effective, and exactly</text>`)
    els.push(`      <text id="Quote-Line2" x="80" y="${yBase + 40}" fill="${fgColor}" font-size="26" font-weight="300">what we needed."</text>`)
    els.push(`      <rect id="Author-Line" x="80" y="${yBase + 90}" width="300" height="1" fill="${borderColor}"/>`)
    els.push(`      <text id="Author-Name" x="400" y="${yBase + 95}" fill="${mutedColor}" font-size="14">Client Name</text>`)
  }
  
  els.push(`    </g>`)
  return els
}

function generateFooterSVG(
  style: string,
  width: number,
  height: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  primaryFgColor: string,
  borderColor: string,
  cardColor: string,
  bgColor: string
): string[] {
  const els: string[] = []
  const yBase = height - 350
  
  els.push(`    <g id="Footer-Section">`)
  els.push(`      <rect id="Footer-Top-Border" x="0" y="${yBase}" width="${width}" height="1" fill="${borderColor}"/>`)
  
  if (style === 'editorial') {
    els.push(`      <text id="Footer-Brand" x="80" y="${yBase + 60}" fill="${fgColor}" font-size="26" font-weight="300">Brand Name</text>`)
    els.push(`      <text id="Footer-Tagline" x="80" y="${yBase + 95}" fill="${mutedColor}" font-size="16">Creating exceptional experiences since 2024.</text>`)
    
    els.push(`      <g id="Navigation-Column">`)
    els.push(`        <text id="Nav-Title" x="${width - 400}" y="${yBase + 50}" fill="${mutedColor}" font-size="12" font-weight="500" letter-spacing="3">NAVIGATION</text>`)
    ;['Link One', 'Link Two', 'Link Three'].forEach((link, i) => {
      els.push(`        <text id="Nav-Link-${i + 1}" x="${width - 400}" y="${yBase + 85 + i * 28}" fill="${fgColor}" font-size="14">${link}</text>`)
    })
    els.push(`      </g>`)
    
    els.push(`      <g id="Connect-Column">`)
    els.push(`        <text id="Connect-Title" x="${width - 200}" y="${yBase + 50}" fill="${mutedColor}" font-size="12" font-weight="500" letter-spacing="3">CONNECT</text>`)
    ;['Link One', 'Link Two', 'Link Three'].forEach((link, i) => {
      els.push(`        <text id="Connect-Link-${i + 1}" x="${width - 200}" y="${yBase + 85 + i * 28}" fill="${fgColor}" font-size="14">${link}</text>`)
    })
    els.push(`      </g>`)
    
    els.push(`      <rect id="Footer-Divider" x="80" y="${yBase + 200}" width="${width - 160}" height="1" fill="${borderColor}"/>`)
    els.push(`      <text id="Copyright" x="80" y="${yBase + 240}" fill="${mutedColor}" font-size="14">© 2024 Brand Name. All rights reserved.</text>`)
  } else if (style === 'action') {
    els.push(`      <g id="Newsletter-Box">`)
    els.push(`        <rect id="Newsletter-Fill" x="80" y="${yBase + 40}" width="${width - 160}" height="140" rx="16" fill="${cardColor}"/>`)
    els.push(`        <rect id="Newsletter-Stroke" x="80" y="${yBase + 40}" width="${width - 160}" height="140" rx="16" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <text id="Newsletter-Title" x="120" y="${yBase + 85}" fill="${fgColor}" font-size="26" font-weight="700">Stay Updated</text>`)
    els.push(`        <text id="Newsletter-Desc" x="120" y="${yBase + 115}" fill="${mutedColor}" font-size="14">Subscribe to our newsletter for the latest updates.</text>`)
    els.push(`        <rect id="Email-Input-Fill" x="${width - 480}" y="${yBase + 75}" width="240" height="44" rx="8" fill="${bgColor}"/>`)
    els.push(`        <rect id="Email-Input-Stroke" x="${width - 480}" y="${yBase + 75}" width="240" height="44" rx="8" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <text id="Email-Placeholder" x="${width - 465}" y="${yBase + 103}" fill="${mutedColor}" font-size="14">Enter your email</text>`)
    els.push(`        <rect id="Subscribe-Button" x="${width - 220}" y="${yBase + 75}" width="120" height="44" rx="8" fill="${primaryColor}"/>`)
    els.push(`        <text id="Subscribe-Text" x="${width - 160}" y="${yBase + 103}" fill="${primaryFgColor}" font-size="14" font-weight="600" text-anchor="middle">Subscribe</text>`)
    els.push(`      </g>`)
    
    els.push(`      <text id="Copyright" x="80" y="${yBase + 240}" fill="${mutedColor}" font-size="14">© 2024 Brand Name</text>`)
    els.push(`      <g id="Footer-Links">`)
    ;['Terms', 'Privacy', 'Contact'].forEach((link, i) => {
      els.push(`        <text id="Link-${link}" x="${width - 200 + i * 70}" y="${yBase + 240}" fill="${mutedColor}" font-size="14">${link}</text>`)
    })
    els.push(`      </g>`)
  } else {
    // Minimalist
    els.push(`      <text id="Footer-Brand" x="80" y="${yBase + 50}" fill="${fgColor}" font-size="18" font-weight="500">Brand</text>`)
    els.push(`      <g id="Footer-Links">`)
    ;['About', 'Work', 'Contact'].forEach((link, i) => {
      els.push(`        <text id="Link-${link}" x="${width - 240 + i * 80}" y="${yBase + 50}" fill="${mutedColor}" font-size="14">${link}</text>`)
    })
    els.push(`      </g>`)
    els.push(`      <rect id="Footer-Divider" x="80" y="${yBase + 90}" width="${width - 160}" height="1" fill="${borderColor}"/>`)
    els.push(`      <text id="Copyright" x="80" y="${yBase + 130}" fill="${mutedColor}" font-size="14">© 2024</text>`)
  }
  
  els.push(`    </g>`)
  return els
}

function generateContactSVG(
  style: string,
  width: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  primaryFgColor: string,
  borderColor: string,
  cardColor: string,
  bgColor: string
): string[] {
  const els: string[] = []
  const yBase = 100
  
  els.push(`    <g id="Contact-Section">`)
  
  if (style === 'editorial') {
    els.push(`      <text id="Contact-Label" x="80" y="${yBase}" fill="${mutedColor}" font-size="12" font-weight="500" letter-spacing="4">GET IN TOUCH</text>`)
    els.push(`      <text id="Contact-Title" x="80" y="${yBase + 60}" fill="${fgColor}" font-size="48" font-weight="300">Let's Start a Conversation</text>`)
    els.push(`      <text id="Contact-Subtitle" x="80" y="${yBase + 100}" fill="${mutedColor}" font-size="18">We'd love to hear from you. Send us a message.</text>`)
    
    // Form fields
    els.push(`      <g id="Contact-Form">`)
    els.push(`        <text id="Name-Label" x="80" y="${yBase + 170}" fill="${mutedColor}" font-size="12" letter-spacing="2">NAME</text>`)
    els.push(`        <rect id="Name-Input-Line" x="80" y="${yBase + 210}" width="500" height="1" fill="${borderColor}"/>`)
    els.push(`        <text id="Email-Label" x="80" y="${yBase + 260}" fill="${mutedColor}" font-size="12" letter-spacing="2">EMAIL</text>`)
    els.push(`        <rect id="Email-Input-Line" x="80" y="${yBase + 300}" width="500" height="1" fill="${borderColor}"/>`)
    els.push(`        <text id="Message-Label" x="80" y="${yBase + 350}" fill="${mutedColor}" font-size="12" letter-spacing="2">MESSAGE</text>`)
    els.push(`        <rect id="Message-Input-Line" x="80" y="${yBase + 430}" width="500" height="1" fill="${borderColor}"/>`)
    els.push(`        <rect id="Submit-Button" x="80" y="${yBase + 470}" width="180" height="48" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <text id="Submit-Text" x="170" y="${yBase + 500}" fill="${fgColor}" font-size="12" font-weight="500" text-anchor="middle" letter-spacing="2">SEND MESSAGE</text>`)
    els.push(`      </g>`)
    
    // Contact info
    els.push(`      <g id="Contact-Info">`)
    els.push(`        <text id="Email-Title" x="${width - 400}" y="${yBase + 170}" fill="${mutedColor}" font-size="12" letter-spacing="2">EMAIL</text>`)
    els.push(`        <text id="Email-Value" x="${width - 400}" y="${yBase + 200}" fill="${fgColor}" font-size="16">hello@company.com</text>`)
    els.push(`        <text id="Phone-Title" x="${width - 400}" y="${yBase + 260}" fill="${mutedColor}" font-size="12" letter-spacing="2">PHONE</text>`)
    els.push(`        <text id="Phone-Value" x="${width - 400}" y="${yBase + 290}" fill="${fgColor}" font-size="16">+1 (555) 000-0000</text>`)
    els.push(`        <text id="Address-Title" x="${width - 400}" y="${yBase + 350}" fill="${mutedColor}" font-size="12" letter-spacing="2">ADDRESS</text>`)
    els.push(`        <text id="Address-Line1" x="${width - 400}" y="${yBase + 380}" fill="${fgColor}" font-size="16">123 Street Name</text>`)
    els.push(`        <text id="Address-Line2" x="${width - 400}" y="${yBase + 405}" fill="${fgColor}" font-size="16">City, State 00000</text>`)
    els.push(`      </g>`)
  } else if (style === 'action') {
    els.push(`      <text id="Contact-Title" x="80" y="${yBase + 50}" fill="${fgColor}" font-size="40" font-weight="700">Get in Touch</text>`)
    els.push(`      <text id="Contact-Subtitle" x="80" y="${yBase + 90}" fill="${mutedColor}" font-size="18">Have a question? We'd love to hear from you.</text>`)
    
    // Contact cards
    els.push(`      <g id="Email-Card">`)
    els.push(`        <rect id="Email-Icon-Bg" x="80" y="${yBase + 140}" width="48" height="48" rx="8" fill="${primaryColor}" fill-opacity="0.15"/>`)
    els.push(`        <text id="Email-Card-Title" x="145" y="${yBase + 160}" fill="${fgColor}" font-size="16" font-weight="600">Email Us</text>`)
    els.push(`        <text id="Email-Card-Value" x="145" y="${yBase + 182}" fill="${mutedColor}" font-size="14">hello@company.com</text>`)
    els.push(`      </g>`)
    
    els.push(`      <g id="Phone-Card">`)
    els.push(`        <rect id="Phone-Icon-Bg" x="80" y="${yBase + 210}" width="48" height="48" rx="8" fill="${primaryColor}" fill-opacity="0.15"/>`)
    els.push(`        <text id="Phone-Card-Title" x="145" y="${yBase + 230}" fill="${fgColor}" font-size="16" font-weight="600">Call Us</text>`)
    els.push(`        <text id="Phone-Card-Value" x="145" y="${yBase + 252}" fill="${mutedColor}" font-size="14">+1 (555) 000-0000</text>`)
    els.push(`      </g>`)
    
    // Form card
    els.push(`      <g id="Form-Card">`)
    els.push(`        <rect id="Form-Card-Fill" x="${width - 520}" y="${yBase + 20}" width="440" height="400" rx="16" fill="${cardColor}"/>`)
    els.push(`        <rect id="Form-Card-Stroke" x="${width - 520}" y="${yBase + 20}" width="440" height="400" rx="16" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <text id="FirstName-Label" x="${width - 490}" y="${yBase + 70}" fill="${fgColor}" font-size="14" font-weight="500">First Name</text>`)
    els.push(`        <rect id="FirstName-Input" x="${width - 490}" y="${yBase + 85}" width="185" height="44" rx="8" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <text id="LastName-Label" x="${width - 285}" y="${yBase + 70}" fill="${fgColor}" font-size="14" font-weight="500">Last Name</text>`)
    els.push(`        <rect id="LastName-Input" x="${width - 285}" y="${yBase + 85}" width="185" height="44" rx="8" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <text id="Email-Label" x="${width - 490}" y="${yBase + 160}" fill="${fgColor}" font-size="14" font-weight="500">Email</text>`)
    els.push(`        <rect id="Email-Input" x="${width - 490}" y="${yBase + 175}" width="390" height="44" rx="8" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <text id="Message-Label" x="${width - 490}" y="${yBase + 250}" fill="${fgColor}" font-size="14" font-weight="500">Message</text>`)
    els.push(`        <rect id="Message-Input" x="${width - 490}" y="${yBase + 265}" width="390" height="80" rx="8" fill="${bgColor}" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`        <rect id="Submit-Button" x="${width - 490}" y="${yBase + 365}" width="390" height="44" rx="8" fill="${primaryColor}"/>`)
    els.push(`        <text id="Submit-Text" x="${width - 295}" y="${yBase + 393}" fill="${primaryFgColor}" font-size="15" font-weight="600" text-anchor="middle">Send Message</text>`)
    els.push(`      </g>`)
  } else {
    // Minimalist
    els.push(`      <text id="Contact-Title" x="80" y="${yBase + 40}" fill="${fgColor}" font-size="28" font-weight="300">Contact</text>`)
    els.push(`      <text id="Contact-Email" x="80" y="${yBase + 80}" fill="${mutedColor}" font-size="16">hello@company.com</text>`)
    
    els.push(`      <g id="Simple-Form">`)
    els.push(`        <rect id="Name-Line" x="80" y="${yBase + 170}" width="400" height="1" fill="${borderColor}"/>`)
    els.push(`        <text id="Name-Placeholder" x="80" y="${yBase + 155}" fill="${mutedColor}" font-size="16">Name</text>`)
    els.push(`        <rect id="Email-Line" x="80" y="${yBase + 240}" width="400" height="1" fill="${borderColor}"/>`)
    els.push(`        <text id="Email-Placeholder" x="80" y="${yBase + 225}" fill="${mutedColor}" font-size="16">Email</text>`)
    els.push(`        <rect id="Message-Line" x="80" y="${yBase + 340}" width="400" height="1" fill="${borderColor}"/>`)
    els.push(`        <text id="Message-Placeholder" x="80" y="${yBase + 295}" fill="${mutedColor}" font-size="16">Message</text>`)
    els.push(`        <text id="Send-Link" x="80" y="${yBase + 400}" fill="${fgColor}" font-size="14" font-weight="500" letter-spacing="2">SEND →</text>`)
    els.push(`      </g>`)
  }
  
  els.push(`    </g>`)
  return els
}

function generateFAQSVG(
  style: string,
  width: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  borderColor: string,
  cardColor: string
): string[] {
  const els: string[] = []
  const yBase = 100
  const questions = ['What services do you offer?', 'How does the process work?', 'What are your rates?', 'How can I get started?']
  
  els.push(`    <g id="FAQ-Section">`)
  
  if (style === 'editorial') {
    els.push(`      <text id="FAQ-Label" x="80" y="${yBase}" fill="${mutedColor}" font-size="12" font-weight="500" letter-spacing="4">QUESTIONS</text>`)
    els.push(`      <text id="FAQ-Title" x="80" y="${yBase + 60}" fill="${fgColor}" font-size="48" font-weight="300">Frequently Asked</text>`)
    
    questions.forEach((q, i) => {
      const y = yBase + 140 + i * 90
      els.push(`      <g id="FAQ-Item-${i + 1}">`)
      els.push(`        <text id="Question-${i + 1}" x="80" y="${y}" fill="${fgColor}" font-size="18">${q}</text>`)
      els.push(`        <text id="Toggle-${i + 1}" x="${width - 160}" y="${y}" fill="${mutedColor}" font-size="24" font-weight="300">+</text>`)
      els.push(`        <rect id="Divider-${i + 1}" x="80" y="${y + 30}" width="${width - 160}" height="1" fill="${borderColor}"/>`)
      els.push(`      </g>`)
    })
  } else if (style === 'action') {
    els.push(`      <text id="FAQ-Title" x="${width / 2}" y="${yBase}" fill="${fgColor}" font-size="36" font-weight="700" text-anchor="middle">Frequently Asked Questions</text>`)
    els.push(`      <text id="FAQ-Subtitle" x="${width / 2}" y="${yBase + 40}" fill="${mutedColor}" font-size="18" text-anchor="middle">Everything you need to know</text>`)
    
    questions.forEach((q, i) => {
      const y = yBase + 100 + i * 80
      els.push(`      <g id="FAQ-Card-${i + 1}">`)
      els.push(`        <rect id="Card-${i + 1}-Fill" x="80" y="${y}" width="${width - 160}" height="65" rx="12" fill="${cardColor}"/>`)
      els.push(`        <rect id="Card-${i + 1}-Stroke" x="80" y="${y}" width="${width - 160}" height="65" rx="12" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
      els.push(`        <text id="Question-${i + 1}" x="110" y="${y + 38}" fill="${fgColor}" font-size="16" font-weight="600">${q}</text>`)
      els.push(`        <circle id="Toggle-Bg-${i + 1}" cx="${width - 130}" cy="${y + 32}" r="16" fill="${primaryColor}" fill-opacity="0.15"/>`)
      els.push(`        <text id="Toggle-${i + 1}" x="${width - 130}" y="${y + 38}" fill="${primaryColor}" font-size="16" text-anchor="middle">+</text>`)
      els.push(`      </g>`)
    })
  } else {
    // Minimalist
    els.push(`      <text id="FAQ-Title" x="80" y="${yBase + 40}" fill="${fgColor}" font-size="24" font-weight="300">FAQ</text>`)
    
    questions.slice(0, 3).forEach((q, i) => {
      const y = yBase + 120 + i * 80
      els.push(`      <g id="FAQ-Item-${i + 1}">`)
      els.push(`        <text id="Question-${i + 1}" x="80" y="${y}" fill="${fgColor}" font-size="16">${q}</text>`)
      els.push(`        <text id="Toggle-${i + 1}" x="${width - 160}" y="${y}" fill="${mutedColor}" font-size="14">+</text>`)
      els.push(`        <rect id="Divider-${i + 1}" x="80" y="${y + 25}" width="${width - 160}" height="1" fill="${borderColor}"/>`)
      els.push(`      </g>`)
    })
  }
  
  els.push(`    </g>`)
  return els
}

function generateCTASVG(
  style: string,
  width: number,
  fgColor: string,
  mutedColor: string,
  primaryColor: string,
  primaryFgColor: string,
  borderColor: string,
  cardColor: string
): string[] {
  const els: string[] = []
  const yBase = 200
  
  els.push(`    <g id="CTA-Section">`)
  
  if (style === 'editorial') {
    els.push(`      <text id="CTA-Label" x="${width / 2}" y="${yBase}" fill="${mutedColor}" font-size="12" font-weight="500" text-anchor="middle" letter-spacing="4">READY TO BEGIN</text>`)
    els.push(`      <text id="CTA-Title" x="${width / 2}" y="${yBase + 80}" fill="${fgColor}" font-size="52" font-weight="300" text-anchor="middle">Start Your Journey Today</text>`)
    els.push(`      <text id="CTA-Subtitle" x="${width / 2}" y="${yBase + 130}" fill="${mutedColor}" font-size="18" text-anchor="middle">Join thousands who have already transformed their experience.</text>`)
    els.push(`      <rect id="CTA-Button-Stroke" x="${width / 2 - 100}" y="${yBase + 180}" width="200" height="52" fill="none" stroke="${borderColor}" stroke-width="1"/>`)
    els.push(`      <text id="CTA-Button-Text" x="${width / 2}" y="${yBase + 212}" fill="${fgColor}" font-size="12" font-weight="500" text-anchor="middle" letter-spacing="2">GET STARTED</text>`)
  } else if (style === 'action') {
    els.push(`      <rect id="CTA-Background" x="0" y="0" width="${width}" height="500" fill="${primaryColor}"/>`)
    els.push(`      <text id="CTA-Title" x="${width / 2}" y="${yBase}" fill="${primaryFgColor}" font-size="48" font-weight="700" text-anchor="middle">Ready to Get Started?</text>`)
    els.push(`      <text id="CTA-Subtitle" x="${width / 2}" y="${yBase + 50}" fill="${primaryFgColor}" font-size="20" text-anchor="middle" opacity="0.9">Join thousands of satisfied customers today.</text>`)
    els.push(`      <g id="CTA-Buttons">`)
    els.push(`        <rect id="Primary-Button-Fill" x="${width / 2 - 220}" y="${yBase + 100}" width="200" height="52" rx="8" fill="${cardColor}"/>`)
    els.push(`        <text id="Primary-Button-Text" x="${width / 2 - 120}" y="${yBase + 132}" fill="${fgColor}" font-size="16" font-weight="600" text-anchor="middle">Start Free Trial</text>`)
    els.push(`        <rect id="Secondary-Button-Stroke" x="${width / 2 + 20}" y="${yBase + 100}" width="200" height="52" rx="8" fill="none" stroke="${primaryFgColor}" stroke-width="2"/>`)
    els.push(`        <text id="Secondary-Button-Text" x="${width / 2 + 120}" y="${yBase + 132}" fill="${primaryFgColor}" font-size="16" font-weight="600" text-anchor="middle">Contact Sales</text>`)
    els.push(`      </g>`)
  } else {
    // Minimalist
    els.push(`      <rect id="CTA-Background" x="0" y="0" width="${width}" height="400" fill="${cardColor}"/>`)
    els.push(`      <text id="CTA-Title" x="80" y="${yBase}" fill="${fgColor}" font-size="24" font-weight="300">Ready to start?</text>`)
    els.push(`      <rect id="Email-Input-Line" x="80" y="${yBase + 80}" width="300" height="1" fill="${borderColor}"/>`)
    els.push(`      <text id="Email-Placeholder" x="80" y="${yBase + 65}" fill="${mutedColor}" font-size="16">Enter your email</text>`)
    els.push(`      <text id="Subscribe-Link" x="420" y="${yBase + 65}" fill="${fgColor}" font-size="14" font-weight="500" letter-spacing="2">SUBSCRIBE →</text>`)
  }
  
  els.push(`    </g>`)
  return els
}

/**
 * Download variant as native SVG file with proper Figma-compatible elements
 */
export function downloadSVGFile(
  variant: GeneratedVariant,
  tokens: DesignTokens
): void {
  const svg = generateNativeSVG(variant, tokens)
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${variant.name.toLowerCase().replace(/\s+/g, '-')}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Download variant as PNG file (rasterized, for reference)
 */
export async function downloadPNGFile(
  variant: GeneratedVariant,
  tokens: DesignTokens
): Promise<void> {
  // Generate SVG first, then convert to PNG
  const svg = generateNativeSVG(variant, tokens)
  
  const canvas = document.createElement('canvas')
  canvas.width = 1440 * 2
  canvas.height = 900 * 2
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  ctx.scale(2, 2)
  
  const img = new Image()
  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)
  
  return new Promise((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve()
          return
        }
        const pngUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `${variant.name.toLowerCase().replace(/\s+/g, '-')}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(pngUrl)
        resolve()
      }, 'image/png')
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve()
    }
    img.src = url
  })
}

/**
 * Download variant as HTML file
 */
export function downloadHTMLFile(
  variant: GeneratedVariant,
  _tokens: DesignTokens
): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${variant.name}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
  </style>
</head>
<body>
  ${variant.html}
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${variant.name.toLowerCase().replace(/\s+/g, '-')}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateApprovalLink(
  projectId: string,
  requestId: string
): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  return `${baseUrl}/preview/${projectId}/${requestId}`
}
