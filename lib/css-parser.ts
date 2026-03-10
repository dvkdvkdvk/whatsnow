import type { DesignTokens } from './store'

export interface HeadingStyles {
  [selector: string]: {
    fontSize?: string
    fontWeight?: string
    lineHeight?: string
    letterSpacing?: string
    fontFamily?: string
    textTransform?: string
    color?: string
  }
}

export function parseCSSVariables(cssContent: string): DesignTokens {
  const tokens: DesignTokens = {
    colors: {},
    spacing: {},
    shadows: {},
    typography: {},
    borderRadius: {},
    zIndex: {},
    headingStyles: {},
  }

  // Extract CSS variables from ALL blocks (not just :root)
  // This handles :root, html, body, *, and any other selectors
  const variableRegex = /--([a-zA-Z0-9-]+)\s*:\s*([^;]+);/g
  let match

  while ((match = variableRegex.exec(cssContent)) !== null) {
    const [, name, value] = match
    const trimmedValue = value.trim()

    // Categorize variables by name patterns
    const lowerName = name.toLowerCase()
    
    // Check for spacing variables
    if (lowerName.includes('space') || lowerName.includes('gap') || lowerName.includes('padding') || lowerName.includes('margin')) {
      tokens.spacing![name] = trimmedValue
    }
    // Check for radius variables  
    else if (lowerName.includes('radius') || lowerName.includes('rounded')) {
      tokens.borderRadius![name] = trimmedValue
    }
    // Check for shadow variables
    else if (lowerName.includes('shadow')) {
      tokens.shadows![name] = trimmedValue
    }
    // Check for typography variables
    else if (lowerName.includes('font') || lowerName.includes('text-size') || lowerName.includes('line-height') || lowerName.includes('letter-spacing')) {
      tokens.typography![name] = trimmedValue
    }
    // Check for color variables
    else if (
      lowerName.includes('color') ||
      lowerName.includes('primary') ||
      lowerName.includes('secondary') ||
      lowerName.includes('accent') ||
      lowerName.includes('background') ||
      lowerName.includes('foreground') ||
      lowerName.includes('muted') ||
      lowerName.includes('destructive') ||
      lowerName.includes('card') ||
      lowerName.includes('border') ||
      lowerName.includes('ring') ||
      lowerName.includes('input') ||
      lowerName.includes('popover') ||
      lowerName.includes('sidebar') ||
      name.includes('chart') ||
      trimmedValue.startsWith('#') ||
      trimmedValue.startsWith('rgb') ||
      trimmedValue.startsWith('hsl') ||
      trimmedValue.startsWith('oklch')
    ) {
      tokens.colors![name] = trimmedValue
    } else if (
      name.includes('spacing') ||
      name.includes('gap') ||
      name.includes('margin') ||
      name.includes('padding')
    ) {
      tokens.spacing![name] = trimmedValue
    } else if (name.includes('shadow')) {
      tokens.shadows![name] = trimmedValue
    } else if (
      name.includes('font') ||
      name.includes('text') ||
      name.includes('line-height') ||
      name.includes('letter-spacing')
    ) {
      tokens.typography![name] = trimmedValue
    } else if (name.includes('radius') || name.includes('rounded')) {
      tokens.borderRadius![name] = trimmedValue
    } else if (name.includes('z-index') || name.includes('zindex')) {
      tokens.zIndex![name] = trimmedValue
    }
  }
  
  // Also extract colors from regular CSS properties (not just variables)
  // This handles CSS like: background-color: #00d2d2; color: #071624;
  const colorPropertyRegex = /(background-color|background|color|border-color|border-bottom-color|border-top-color|border-left-color|border-right-color|outline-color|fill|stroke)\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)|hsla?\([^)]+\)|oklch\([^)]+\))/gi
  let colorMatch
  const extractedColors = new Map<string, string>()
  
  while ((colorMatch = colorPropertyRegex.exec(cssContent)) !== null) {
    const [, property, colorValue] = colorMatch
    const trimmedColor = colorValue.trim()
    const normalizedColor = trimmedColor.toLowerCase()
    
    // Only add unique colors
    if (!extractedColors.has(normalizedColor)) {
      extractedColors.set(normalizedColor, trimmedColor)
    }
  }
  
  // Now analyze all extracted colors and assign semantic names
  const colorList = Array.from(extractedColors.values())

  
  // Helper to determine if a color is dark, light, or vibrant
  const parseHexColor = (hex: string): { r: number; g: number; b: number } | null => {
    const c = hex.toLowerCase().replace(/\s/g, '')
    if (!c.startsWith('#')) return null
    const h = c.slice(1)
    let r = 0, g = 0, b = 0
    if (h.length === 3) {
      r = parseInt(h[0] + h[0], 16)
      g = parseInt(h[1] + h[1], 16)
      b = parseInt(h[2] + h[2], 16)
    } else if (h.length >= 6) {
      r = parseInt(h.slice(0, 2), 16)
      g = parseInt(h.slice(2, 4), 16)
      b = parseInt(h.slice(4, 6), 16)
    }
    return { r, g, b }
  }
  
  const getBrightness = (color: string): number => {
    const rgb = parseHexColor(color)
    if (!rgb) return 128
    return (rgb.r + rgb.g + rgb.b) / 3
  }
  
  const isGrayscale = (color: string): boolean => {
    const rgb = parseHexColor(color)
    if (!rgb) return false
    const maxDiff = Math.max(Math.abs(rgb.r - rgb.g), Math.abs(rgb.g - rgb.b), Math.abs(rgb.r - rgb.b))
    return maxDiff < 30
  }
  
  // Categorize colors
  const darkColors = colorList.filter(c => isGrayscale(c) && getBrightness(c) < 60)
  const lightColors = colorList.filter(c => isGrayscale(c) && getBrightness(c) > 200)
  const accentColors = colorList.filter(c => !isGrayscale(c))
  
  // Assign semantic names based on what we found
  // If we have dark colors, assume dark theme
  if (darkColors.length > 0 && !tokens.colors!['background']) {
    tokens.colors!['background'] = darkColors[0]
  }
  if (lightColors.length > 0 && !tokens.colors!['foreground']) {
    tokens.colors!['foreground'] = lightColors[0]
  }
  if (accentColors.length > 0 && !tokens.colors!['primary']) {
    tokens.colors!['primary'] = accentColors[0]

  }
  if (accentColors.length > 1 && !tokens.colors!['accent']) {
    tokens.colors!['accent'] = accentColors[1]
  }

  
  // Also store all unique colors with indexed names for reference
  let colorIndex = 1
  for (const color of colorList) {
    const key = `color-${colorIndex}`
    if (!Object.values(tokens.colors!).includes(color)) {
      tokens.colors![key] = color
    }
    colorIndex++
  }
  
  // Extract spacing values (padding, margin, gap) - ONLY clean numeric values
  const spacingRegex = /(?:padding|margin|gap)(?:-(?:top|right|bottom|left|x|y|inline|block))?:\s*(\d+(?:\.\d+)?(?:px|rem|em|%))\s*(?:;|$|!)/gi
  let spacingMatch
  const spacingSet = new Set<string>()
  while ((spacingMatch = spacingRegex.exec(cssContent)) !== null) {
    const val = spacingMatch[1]?.trim()
    // Only accept clean, short values (no CSS blocks or long strings)
    if (val && val.length < 20 && /^\d+(?:\.\d+)?(?:px|rem|em|%)$/.test(val) && !spacingSet.has(val)) {
      spacingSet.add(val)
      tokens.spacing![`space-${spacingSet.size}`] = val
    }
  }
  
  // Extract border-radius values - ONLY clean numeric values
  const radiusRegex = /border-radius:\s*(\d+(?:\.\d+)?(?:px|rem|em|%))\s*(?:;|$|!)/gi
  let radiusMatch
  const radiusSet = new Set<string>()
  while ((radiusMatch = radiusRegex.exec(cssContent)) !== null) {
    const val = radiusMatch[1]?.trim()
    // Only accept clean, short values
    if (val && val.length < 20 && /^\d+(?:\.\d+)?(?:px|rem|em|%)$/.test(val) && !radiusSet.has(val)) {
      radiusSet.add(val)
      tokens.borderRadius![`radius-${radiusSet.size}`] = val
    }
  }
  
  // Extract box-shadow values - validate format
  const shadowRegex = /box-shadow:\s*([^;}]+)(?:;|$)/gi
  let shadowMatch
  const shadowSet = new Set<string>()
  while ((shadowMatch = shadowRegex.exec(cssContent)) !== null) {
    const val = shadowMatch[1]?.trim()
    // Only accept valid shadow values (contain px/em and don't start with 0} or other garbage)
    if (val && val.length < 200 && !val.startsWith('var(') && val !== 'none' && 
        !val.startsWith('0}') && !val.includes('{') && !val.includes('}') &&
        /\d+px|\d+em|\d+rem/.test(val) && !shadowSet.has(val)) {
      shadowSet.add(val)
      tokens.shadows![`shadow-${shadowSet.size}`] = val
    }
  }
  
  // Extract font-family values - validate format
  const fontFamilyRegex = /font-family:\s*([^;{}]+)(?:;|$)/gi
  let fontMatch
  const fontSet = new Set<string>()
  while ((fontMatch = fontFamilyRegex.exec(cssContent)) !== null) {
    const val = fontMatch[1]?.trim()
    // Only accept valid font names (no CSS blocks, no 0}, reasonable length)
    if (val && val.length < 150 && !val.startsWith('var(') && 
        !val.startsWith('0}') && !val.includes('{') && !val.includes('}') &&
        !fontSet.has(val)) {
      fontSet.add(val)
      const name = fontSet.size === 1 ? 'font-primary' : fontSet.size === 2 ? 'font-secondary' : `font-${fontSet.size}`
      tokens.typography![name] = val
    }
  }
  
  // Extract font-size values - clean numeric only
  const fontSizeRegex = /font-size:\s*(\d+(?:\.\d+)?(?:px|rem|em|%)|calc\([^)]+\))\s*(?:;|$|!)/gi
  let sizeMatch
  const sizeSet = new Set<string>()
  while ((sizeMatch = fontSizeRegex.exec(cssContent)) !== null) {
    const val = sizeMatch[1]?.trim()
    // Only accept valid font-size values
    if (val && val.length < 50 && !val.includes('{') && !val.includes('}') && !sizeSet.has(val)) {
      sizeSet.add(val)
      tokens.typography![`text-size-${sizeSet.size}`] = val
    }
  }
  
  // Also look for var(--name) references to identify used variables
  const varRefRegex = /var\(--([a-zA-Z0-9-]+)\)/g
  let varMatch
  while ((varMatch = varRefRegex.exec(cssContent)) !== null) {
    const varName = varMatch[1]
    // Mark this variable as used (even if we don't have its value)
    if (!tokens.colors![varName]) {
      tokens.colors![varName] = `var(--${varName})`
    }
  }
  
  // Parse heading styles (h1, h2, h3, h4, h5, h6, p, body, .heading, .title, etc.)
  const headingSelectors = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'body', 'a', 'button', 'label', '.heading', '.title', '.subtitle', '.text', '.body']
  
  for (const selector of headingSelectors) {
    // Match selector { ... } blocks - handle various formats
    const selectorRegex = new RegExp(`(?:^|[,}\\s])${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`, 'gim')
    let selectorMatch
    
    while ((selectorMatch = selectorRegex.exec(cssContent)) !== null) {
      const styles = selectorMatch[1]
      const styleObj: HeadingStyles[string] = {}
      
      // Extract individual properties
      const fontSizeMatch = styles.match(/font-size\s*:\s*([^;]+)/i)
      if (fontSizeMatch) styleObj.fontSize = fontSizeMatch[1].trim()
      
      const fontWeightMatch = styles.match(/font-weight\s*:\s*([^;]+)/i)
      if (fontWeightMatch) styleObj.fontWeight = fontWeightMatch[1].trim()
      
      const lineHeightMatch = styles.match(/line-height\s*:\s*([^;]+)/i)
      if (lineHeightMatch) styleObj.lineHeight = lineHeightMatch[1].trim()
      
      const letterSpacingMatch = styles.match(/letter-spacing\s*:\s*([^;]+)/i)
      if (letterSpacingMatch) styleObj.letterSpacing = letterSpacingMatch[1].trim()
      
      const fontFamilyMatch = styles.match(/font-family\s*:\s*([^;]+)/i)
      if (fontFamilyMatch) styleObj.fontFamily = fontFamilyMatch[1].trim()
      
      const textTransformMatch = styles.match(/text-transform\s*:\s*([^;]+)/i)
      if (textTransformMatch) styleObj.textTransform = textTransformMatch[1].trim()
      
      const colorMatch = styles.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i)
      if (colorMatch) styleObj.color = colorMatch[1].trim()
      
      if (Object.keys(styleObj).length > 0) {
        tokens.headingStyles![selector] = { ...tokens.headingStyles![selector], ...styleObj }
      }
    }
  }

  return tokens
}

export function parseJSONTokens(jsonContent: string): DesignTokens {
  try {
    const parsed = JSON.parse(jsonContent)
    
    console.log("[v0] JSON parser - raw parsed object keys:", Object.keys(parsed))
    
    const tokens: DesignTokens = {
      colors: {},
      spacing: {},
      shadows: {},
      typography: {},
      borderRadius: {},
      zIndex: {},
    }

    // Handle different JSON token formats
    const processTokens = (
      obj: Record<string, unknown>,
      category: keyof DesignTokens,
      prefix = ''
    ) => {
      if (!obj || typeof obj !== 'object') return
      
      for (const [key, value] of Object.entries(obj)) {
        const tokenName = prefix ? `${prefix}-${key}` : key
        
        if (typeof value === 'string' || typeof value === 'number') {
          (tokens[category] as Record<string, string>)[tokenName] = String(value)
        } else if (
          typeof value === 'object' &&
          value !== null &&
          'value' in value
        ) {
          (tokens[category] as Record<string, string>)[tokenName] = String(
            (value as { value: unknown }).value
          )
        } else if (typeof value === 'object' && value !== null) {
          processTokens(
            value as Record<string, unknown>,
            category,
            tokenName
          )
        }
      }
    }

    // Process each category if present - check multiple naming conventions
    const colorKeys = ['colors', 'color', 'palette', 'primitives', 'semantic']
    for (const key of colorKeys) {
      if (parsed[key]) {
        console.log("[v0] JSON parser - found colors in:", key)
        processTokens(parsed[key] as Record<string, unknown>, 'colors')
      }
    }
    
    // Also check for top-level color-like keys (background, foreground, primary, etc.)
    const colorPatterns = ['background', 'foreground', 'primary', 'secondary', 'accent', 'muted', 'card', 'border', 'destructive', 'text', 'surface']
    for (const pattern of colorPatterns) {
      if (parsed[pattern] && typeof parsed[pattern] === 'string') {
        tokens.colors![pattern] = parsed[pattern]
      } else if (parsed[pattern] && typeof parsed[pattern] === 'object') {
        processTokens({ [pattern]: parsed[pattern] } as Record<string, unknown>, 'colors')
      }
    }
    
    if (parsed.spacing || parsed.space) {
      processTokens((parsed.spacing || parsed.space) as Record<string, unknown>, 'spacing')
    }
    if (parsed.shadows || parsed.shadow || parsed.elevation) {
      processTokens((parsed.shadows || parsed.shadow || parsed.elevation) as Record<string, unknown>, 'shadows')
    }
    if (parsed.typography || parsed.fonts || parsed.font || parsed.fontFamily || parsed.fontFamilies) {
      processTokens(
        (parsed.typography || parsed.fonts || parsed.font || parsed.fontFamily || parsed.fontFamilies) as Record<string, unknown>,
        'typography'
      )
    }
    if (parsed.borderRadius || parsed.radii || parsed.radius || parsed.rounded) {
      processTokens(
        (parsed.borderRadius || parsed.radii || parsed.radius || parsed.rounded) as Record<string, unknown>,
        'borderRadius'
      )
    }
    if (parsed.zIndex || parsed.z) {
      processTokens((parsed.zIndex || parsed.z) as Record<string, unknown>, 'zIndex')
    }
    
    // Handle components
    if (parsed.components && typeof parsed.components === 'object') {
      tokens.components = {}
      for (const [name, def] of Object.entries(parsed.components)) {
        if (def && typeof def === 'object') {
          const compDef = def as Record<string, unknown>
          tokens.components[name] = {
            description: compDef.description as string | undefined,
            props: compDef.props as string[] | undefined,
            className: compDef.className as string | undefined,
          }
        }
      }
    }

    console.log("[v0] JSON parser - extracted colors:", Object.keys(tokens.colors || {}))
    console.log("[v0] JSON parser - extracted typography:", Object.keys(tokens.typography || {}))
    console.log("[v0] JSON parser - extracted components:", Object.keys(tokens.components || {}))

    return tokens
  } catch (e) {
    console.error('[v0] Failed to parse JSON tokens:', e)
    return {}
  }
}

// Clean up tokens by removing invalid/garbage values
export function cleanupTokens(tokens: DesignTokens): DesignTokens {
  const isValidValue = (val: string): boolean => {
    if (!val || typeof val !== 'string') return false
    // Reject values that contain CSS block syntax
    if (val.includes('{') || val.includes('}')) return false
    // Reject values that start with common garbage patterns
    if (val.startsWith('0}') || val.startsWith('0):') || val.startsWith('0;')) return false
    // Reject very long values (likely garbage)
    if (val.length > 200) return false
    // Reject values containing selectors
    if (val.includes('::') || val.includes(':host') || val.includes('@')) return false
    return true
  }

  const cleanObject = (obj: Record<string, string> | undefined): Record<string, string> => {
    if (!obj) return {}
    const cleaned: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj)) {
      if (isValidValue(value)) {
        cleaned[key] = value
      }
    }
    return cleaned
  }

  return {
    colors: cleanObject(tokens.colors),
    spacing: cleanObject(tokens.spacing),
    shadows: cleanObject(tokens.shadows),
    typography: cleanObject(tokens.typography),
    borderRadius: cleanObject(tokens.borderRadius),
    zIndex: cleanObject(tokens.zIndex),
    headingStyles: tokens.headingStyles,
    components: tokens.components,
  }
}

export function mergeTokens(
  existing: DesignTokens,
  newTokens: DesignTokens
): DesignTokens {
  // Deep merge heading styles
  const mergedHeadingStyles = { ...existing.headingStyles }
  if (newTokens.headingStyles) {
    for (const [selector, styles] of Object.entries(newTokens.headingStyles)) {
      mergedHeadingStyles[selector] = { ...mergedHeadingStyles[selector], ...styles }
    }
  }
  
  return {
    colors: { ...existing.colors, ...newTokens.colors },
    spacing: { ...existing.spacing, ...newTokens.spacing },
    shadows: { ...existing.shadows, ...newTokens.shadows },
    typography: { ...existing.typography, ...newTokens.typography },
    borderRadius: { ...existing.borderRadius, ...newTokens.borderRadius },
    zIndex: { ...existing.zIndex, ...newTokens.zIndex },
    headingStyles: mergedHeadingStyles,
    components: { ...existing.components, ...newTokens.components },
  }
}
