import { NextResponse } from 'next/server'
import { analyze } from '@projectwallace/css-analyzer'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    let parsedUrl: URL
    try {
      parsedUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Fetch the webpage
    const response = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CSSCrawler/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400 }
      )
    }

    const html = await response.text()

    // Extract CSS from inline <style> tags
    const styleTagRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi
    const inlineStyles: string[] = []
    let match
    while ((match = styleTagRegex.exec(html)) !== null) {
      inlineStyles.push(match[1].trim())
    }

    // Extract linked stylesheet URLs
    const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>|<link[^>]*href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi
    const stylesheetUrls: string[] = []
    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1] || match[2]
      if (href) {
        try {
          const absoluteUrl = new URL(href, parsedUrl.origin).toString()
          stylesheetUrls.push(absoluteUrl)
        } catch {
          // Skip invalid URLs
        }
      }
    }

    // Fetch external stylesheets (limit to first 5 to avoid timeout)
    const externalStyles: string[] = []
    const limitedUrls = stylesheetUrls.slice(0, 5)
    
    await Promise.all(
      limitedUrls.map(async (cssUrl) => {
        try {
          const cssResponse = await fetch(cssUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; CSSCrawler/1.0)',
            },
          })
          if (cssResponse.ok) {
            const cssText = await cssResponse.text()
            externalStyles.push(cssText)
          }
        } catch {
          // Skip failed fetches
        }
      })
    )

    // Combine all CSS
    const allCSS = [...inlineStyles, ...externalStyles].join('\n\n')

    // Use Project Wallace analyzer for deep CSS analysis
    let analysis
    try {
      analysis = analyze(allCSS)
    } catch (e) {
      console.error('CSS analysis error:', e)
      analysis = null
    }

    // Extract design tokens from the analysis
    const designTokens: {
      colors: Record<string, number>
      fontFamilies: Record<string, number>
      fontSizes: Record<string, number>
      fontWeights: Record<string, number>
      lineHeights: Record<string, number>
      borderRadii: Record<string, number>
      boxShadows: Record<string, number>
      spacing: Record<string, number>
      transitions: Record<string, number>
      cssVariables: string[]
    } = {
      colors: {},
      fontFamilies: {},
      fontSizes: {},
      fontWeights: {},
      lineHeights: {},
      borderRadii: {},
      boxShadows: {},
      spacing: {},
      transitions: {},
      cssVariables: [],
    }

    if (analysis) {
      // Get unique values with their usage counts
      designTokens.colors = analysis.values?.colors?.unique || {}
      designTokens.fontFamilies = analysis.values?.fontFamilies?.unique || {}
      designTokens.fontSizes = analysis.values?.fontSizes?.unique || {}
      designTokens.fontWeights = analysis.values?.fontWeights?.unique || {}
      designTokens.lineHeights = analysis.values?.lineHeights?.unique || {}
      designTokens.borderRadii = analysis.values?.borderRadiuses?.unique || {}
      designTokens.boxShadows = analysis.values?.boxShadows?.unique || {}
    }
    
    // Extract spacing values (padding, margin, gap) manually
    const spacingRegex = /(?:padding|margin|gap)(?:-(?:top|right|bottom|left|inline|block|x|y))?:\s*([^;]+)/gi
    let spacingMatch
    while ((spacingMatch = spacingRegex.exec(allCSS)) !== null) {
      const value = spacingMatch[1].trim()
      // Skip CSS variables and calc
      if (!value.startsWith('var(') && !value.startsWith('calc(')) {
        designTokens.spacing[value] = (designTokens.spacing[value] || 0) + 1
      }
    }
    
    // Extract transitions
    const transitionRegex = /transition(?:-property|-duration|-timing-function|-delay)?:\s*([^;]+)/gi
    let transitionMatch
    while ((transitionMatch = transitionRegex.exec(allCSS)) !== null) {
      const value = transitionMatch[1].trim()
      if (value !== 'none' && value !== 'inherit') {
        designTokens.transitions[value] = (designTokens.transitions[value] || 0) + 1
      }
    }
    
    // Extract hover/focus states patterns
    const hoverPatterns: string[] = []
    const hoverRegex = /:hover\s*\{([^}]+)\}/gi
    let hoverMatch
    while ((hoverMatch = hoverRegex.exec(allCSS)) !== null) {
      hoverPatterns.push(hoverMatch[1].trim())
    }
    
    const focusPatterns: string[] = []
    const focusRegex = /:focus(?:-visible|-within)?\s*\{([^}]+)\}/gi
    let focusMatch
    while ((focusMatch = focusRegex.exec(allCSS)) !== null) {
      focusPatterns.push(focusMatch[1].trim())
    }

    // Also extract CSS custom properties (variables)
    const cssVarRegex = /--([\w-]+)\s*:\s*([^;]+)/g
    const variables: Array<{ name: string; value: string }> = []
    let varMatch
    while ((varMatch = cssVarRegex.exec(allCSS)) !== null) {
      variables.push({
        name: varMatch[1].trim(),
        value: varMatch[2].trim(),
      })
    }

    // Build a clean CSS output with extracted tokens
    const extractedCSS = buildExtractedCSS(designTokens, variables, hoverPatterns, focusPatterns)

    // Sort all tokens by usage frequency
    const sortByUsage = (obj: Record<string, number>, limit: number) =>
      Object.entries(obj).sort(([, a], [, b]) => b - a).slice(0, limit)

    return NextResponse.json({
      success: true,
      css: extractedCSS,
      rawCSS: allCSS.slice(0, 50000),
      summary: {
        inlineStyleBlocks: inlineStyles.length,
        externalStylesheets: stylesheetUrls.length,
        fetchedStylesheets: externalStyles.length,
        totalColors: Object.keys(designTokens.colors).length,
        totalFontFamilies: Object.keys(designTokens.fontFamilies).length,
        totalFontSizes: Object.keys(designTokens.fontSizes).length,
        totalSpacing: Object.keys(designTokens.spacing).length,
        totalBorderRadii: Object.keys(designTokens.borderRadii).length,
        totalShadows: Object.keys(designTokens.boxShadows).length,
        cssVariables: variables.length,
      },
      tokens: {
        colors: sortByUsage(designTokens.colors, 20),
        fontFamilies: sortByUsage(designTokens.fontFamilies, 10),
        fontSizes: sortByUsage(designTokens.fontSizes, 15),
        fontWeights: sortByUsage(designTokens.fontWeights, 10),
        spacing: sortByUsage(designTokens.spacing, 15),
        borderRadii: sortByUsage(designTokens.borderRadii, 10),
        boxShadows: sortByUsage(designTokens.boxShadows, 5),
        transitions: sortByUsage(designTokens.transitions, 5),
        variables: variables.slice(0, 50),
        hoverPatterns: hoverPatterns.slice(0, 10),
        focusPatterns: focusPatterns.slice(0, 10),
      },
    })
  } catch (error) {
    console.error('CSS scrape error:', error)
    return NextResponse.json(
      { error: 'Failed to scrape CSS from URL' },
      { status: 500 }
    )
  }
}

function buildExtractedCSS(
  tokens: {
    colors: Record<string, number>
    fontFamilies: Record<string, number>
    fontSizes: Record<string, number>
    fontWeights: Record<string, number>
    lineHeights: Record<string, number>
    borderRadii: Record<string, number>
    boxShadows: Record<string, number>
    spacing: Record<string, number>
    transitions: Record<string, number>
  },
  variables: Array<{ name: string; value: string }>,
  hoverPatterns: string[],
  focusPatterns: string[]
): string {
  const lines: string[] = []
  const sortByUsage = (obj: Record<string, number>, limit: number) =>
    Object.entries(obj).sort(([, a], [, b]) => b - a).slice(0, limit)
  
  lines.push('/* ===== EXTRACTED DESIGN TOKENS ===== */')
  lines.push('')
  lines.push(':root {')
  
  // Add CSS variables first (most important - site's own design system)
  if (variables.length > 0) {
    lines.push('  /* CSS Custom Properties */')
    const seenVars = new Set<string>()
    for (const v of variables) {
      if (!seenVars.has(v.name)) {
        seenVars.add(v.name)
        lines.push(`  --${v.name}: ${v.value};`)
      }
    }
    lines.push('')
  }

  // Colors - categorize and name semantically
  const colorEntries = sortByUsage(tokens.colors, 20)
  if (colorEntries.length > 0) {
    lines.push('  /* Colors */')
    
    // Separate neutrals from accents
    const isNeutral = (hex: string): boolean => {
      const h = hex.toLowerCase()
      if (h.match(/^#(fff|000|f{3,6}|0{3,6})$/i)) return true
      if (h.match(/^#([0-9a-f])\1{5}$/i)) return true
      let r = 128, g = 128, b = 128
      if (h.length === 4) {
        r = parseInt(h[1] + h[1], 16); g = parseInt(h[2] + h[2], 16); b = parseInt(h[3] + h[3], 16)
      } else if (h.length === 7) {
        r = parseInt(h.slice(1, 3), 16); g = parseInt(h.slice(3, 5), 16); b = parseInt(h.slice(5, 7), 16)
      }
      return Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b)) < 25
    }
    
    const getBrightness = (hex: string): number => {
      const h = hex.toLowerCase()
      let r = 128, g = 128, b = 128
      if (h.length === 4) {
        r = parseInt(h[1] + h[1], 16); g = parseInt(h[2] + h[2], 16); b = parseInt(h[3] + h[3], 16)
      } else if (h.length === 7) {
        r = parseInt(h.slice(1, 3), 16); g = parseInt(h.slice(3, 5), 16); b = parseInt(h.slice(5, 7), 16)
      }
      return (r + g + b) / 3
    }
    
    const neutrals = colorEntries.filter(([c]) => isNeutral(c)).sort((a, b) => getBrightness(b[0]) - getBrightness(a[0]))
    const accents = colorEntries.filter(([c]) => !isNeutral(c))
    
    // Output accents first with semantic names
    accents.forEach(([color, count], i) => {
      const name = i === 0 ? 'primary' : i === 1 ? 'secondary' : i === 2 ? 'accent' : `brand-${i + 1}`
      lines.push(`  --color-${name}: ${color}; /* ${count}x */`)
    })
    
    // Output neutrals with semantic names based on brightness
    const usedNames = new Set<string>()
    neutrals.forEach(([color, count]) => {
      const brightness = getBrightness(color)
      let name: string
      if (brightness > 240 && !usedNames.has('white')) { name = 'white'; usedNames.add('white') }
      else if (brightness > 200 && !usedNames.has('background')) { name = 'background'; usedNames.add('background') }
      else if (brightness > 150 && !usedNames.has('surface')) { name = 'surface'; usedNames.add('surface') }
      else if (brightness > 100 && !usedNames.has('muted')) { name = 'muted'; usedNames.add('muted') }
      else if (brightness > 60 && !usedNames.has('border')) { name = 'border'; usedNames.add('border') }
      else if (brightness < 30 && !usedNames.has('black')) { name = 'black'; usedNames.add('black') }
      else if (brightness < 60 && !usedNames.has('foreground')) { name = 'foreground'; usedNames.add('foreground') }
      else { name = `gray-${usedNames.size}`; usedNames.add(name) }
      lines.push(`  --color-${name}: ${color}; /* ${count}x */`)
    })
    lines.push('')
  }

  // Typography
  const fontEntries = sortByUsage(tokens.fontFamilies, 5)
  if (fontEntries.length > 0) {
    lines.push('  /* Typography - Fonts */')
    fontEntries.forEach(([font, count], index) => {
      const name = index === 0 ? 'primary' : index === 1 ? 'secondary' : `font-${index + 1}`
      lines.push(`  --font-${name}: ${font}; /* ${count}x */`)
    })
    lines.push('')
  }

  const sizeEntries = sortByUsage(tokens.fontSizes, 10)
  if (sizeEntries.length > 0) {
    lines.push('  /* Typography - Sizes */')
    sizeEntries.forEach(([size, count]) => {
      const name = guessSizeName(size)
      lines.push(`  --text-${name}: ${size}; /* ${count}x */`)
    })
    lines.push('')
  }

  const weightEntries = sortByUsage(tokens.fontWeights, 6)
  if (weightEntries.length > 0) {
    lines.push('  /* Typography - Weights */')
    weightEntries.forEach(([weight, count]) => {
      const name = guessWeightName(weight)
      lines.push(`  --font-weight-${name}: ${weight}; /* ${count}x */`)
    })
    lines.push('')
  }

  // Spacing
  const spacingEntries = sortByUsage(tokens.spacing, 12)
  if (spacingEntries.length > 0) {
    lines.push('  /* Spacing */')
    spacingEntries.forEach(([space, count], index) => {
      lines.push(`  --space-${index + 1}: ${space}; /* ${count}x */`)
    })
    lines.push('')
  }

  // Border Radius
  const radiusEntries = sortByUsage(tokens.borderRadii, 8)
  if (radiusEntries.length > 0) {
    lines.push('  /* Border Radius */')
    radiusEntries.forEach(([radius, count], index) => {
      const name = guessRadiusName(radius, index)
      lines.push(`  --radius-${name}: ${radius}; /* ${count}x */`)
    })
    lines.push('')
  }

  // Shadows
  const shadowEntries = sortByUsage(tokens.boxShadows, 5)
  if (shadowEntries.length > 0) {
    lines.push('  /* Box Shadows */')
    shadowEntries.forEach(([shadow, count], index) => {
      const name = index === 0 ? 'sm' : index === 1 ? 'md' : index === 2 ? 'lg' : `shadow-${index + 1}`
      lines.push(`  --shadow-${name}: ${shadow}; /* ${count}x */`)
    })
    lines.push('')
  }

  // Transitions
  const transitionEntries = sortByUsage(tokens.transitions, 5)
  if (transitionEntries.length > 0) {
    lines.push('  /* Transitions */')
    transitionEntries.forEach(([transition, count], index) => {
      lines.push(`  --transition-${index + 1}: ${transition}; /* ${count}x */`)
    })
    lines.push('')
  }

  lines.push('}')
  
  // Add hover/focus patterns as reference
  if (hoverPatterns.length > 0) {
    lines.push('')
    lines.push('/* ===== HOVER PATTERNS ===== */')
    hoverPatterns.slice(0, 5).forEach((pattern, i) => {
      lines.push(`/* Hover ${i + 1}: ${pattern.slice(0, 100)}${pattern.length > 100 ? '...' : ''} */`)
    })
  }
  
  if (focusPatterns.length > 0) {
    lines.push('')
    lines.push('/* ===== FOCUS PATTERNS ===== */')
    focusPatterns.slice(0, 5).forEach((pattern, i) => {
      lines.push(`/* Focus ${i + 1}: ${pattern.slice(0, 100)}${pattern.length > 100 ? '...' : ''} */`)
    })
  }
  
  return lines.join('\n')
}

function guessSizeName(size: string): string {
  const num = parseFloat(size)
  if (size.includes('rem')) {
    if (num <= 0.75) return 'xs'
    if (num <= 0.875) return 'sm'
    if (num <= 1) return 'base'
    if (num <= 1.25) return 'lg'
    if (num <= 1.5) return 'xl'
    if (num <= 2) return '2xl'
    if (num <= 3) return '3xl'
    return '4xl'
  }
  if (size.includes('px')) {
    if (num <= 12) return 'xs'
    if (num <= 14) return 'sm'
    if (num <= 16) return 'base'
    if (num <= 18) return 'lg'
    if (num <= 24) return 'xl'
    if (num <= 30) return '2xl'
    if (num <= 36) return '3xl'
    return '4xl'
  }
  return size.replace(/[^a-z0-9]/gi, '-')
}

function guessWeightName(weight: string): string {
  const num = parseInt(weight)
  if (num <= 300 || weight === 'light') return 'light'
  if (num <= 400 || weight === 'normal') return 'normal'
  if (num <= 500 || weight === 'medium') return 'medium'
  if (num <= 600 || weight === 'semibold') return 'semibold'
  if (num <= 700 || weight === 'bold') return 'bold'
  return 'extrabold'
}

function guessRadiusName(radius: string, index: number): string {
  const num = parseFloat(radius)
  if (radius === '0' || radius === '0px') return 'none'
  if (radius === '50%' || radius === '9999px' || num >= 9999) return 'full'
  if (radius.includes('px')) {
    if (num <= 2) return 'sm'
    if (num <= 4) return 'md'
    if (num <= 8) return 'lg'
    if (num <= 12) return 'xl'
    return '2xl'
  }
  return `r-${index + 1}`
}


