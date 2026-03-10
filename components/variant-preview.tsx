'use client'

import * as React from 'react'
import {
  Check,
  Download,
  ExternalLink,
  Sparkles,
  Code2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { GeneratedVariant, DesignTokens } from '@/lib/store'
import { downloadSVGFile } from '@/lib/figma-export'

interface VariantPreviewProps {
  variant: GeneratedVariant
  tokens: DesignTokens
  isSelected?: boolean
  onSelect?: () => void
  projectId?: string
  requestId?: string
  cssContent?: string
  allVariants?: GeneratedVariant[]
  projectName?: string
  clientName?: string
  prompt?: string
}

export function VariantPreview({
  variant,
  tokens,
  isSelected,
  onSelect,
  projectId,
  requestId,
  cssContent,
  allVariants,
  projectName,
  clientName,
  prompt,
}: VariantPreviewProps) {
  const [copied, setCopied] = React.useState(false)
  const [isCreatingPreview, setIsCreatingPreview] = React.useState(false)
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  const styleMap: Record<string, { label: string; bg: string; text: string }> = {
    editorial: { label: 'Editorial', bg: 'bg-amber-500/20', text: 'text-amber-500' },
    action: { label: 'Action', bg: 'bg-primary/15', text: 'text-primary' },
    minimalist: { label: 'Minimal', bg: 'bg-muted', text: 'text-foreground' },
  }

  // Extract colors from tokens - look for any key that might indicate background/foreground
  const findColor = (keys: string[]): string | undefined => {
    const colors = tokens.colors || {}
    for (const key of keys) {
      if (colors[key]) return colors[key]
      for (const [k, v] of Object.entries(colors)) {
        if (k.toLowerCase().includes(key.toLowerCase()) && v && !v.startsWith('var(')) {
          return v
        }
      }
    }
    return undefined
  }
  
  // Get brand colors
  const bgColor = findColor(['background', 'bg', 'surface']) || '#0a0a0a'
  const fgColor = findColor(['foreground', 'fg', 'text']) || '#ffffff'
  const primaryColor = findColor(['primary', 'accent', 'brand']) || '#E6FF2A'
  const mutedColor = findColor(['muted', 'secondary']) || '#888888'
  const cardColor = findColor(['card', 'surface']) || '#1a1a1a'
  const borderColor = findColor(['border']) || '#333333'
  
  // Get typography
  const fontFamily = tokens.typography?.['font-family'] || tokens.typography?.['font-primary'] || 'system-ui, -apple-system, sans-serif'
  const borderRadius = tokens.borderRadius ? Object.values(tokens.borderRadius)[0] || '8px' : '8px'

  // Build comprehensive brand CSS that overrides EVERYTHING
  const brandCSS = `
    /* FORCE BRAND COLORS */
    html, body {
      background-color: ${bgColor} !important;
      color: ${fgColor} !important;
      font-family: ${fontFamily} !important;
      margin: 0;
      padding: 0;
      min-height: 100vh;
    }
    section, div, article, main, header, footer {
      background-color: inherit;
      color: inherit;
    }
    h1, h2, h3, h4, h5, h6 {
      color: ${fgColor} !important;
    }
    p, span, li {
      color: inherit;
    }
    a {
      color: ${primaryColor} !important;
    }
    button, [role="button"], .btn, .button {
      background-color: ${primaryColor} !important;
      color: ${bgColor} !important;
      border-radius: ${borderRadius};
      border: none !important;
    }
    .text-muted, .text-secondary, [class*="text-gray"], [class*="text-slate"], [class*="text-zinc"] {
      color: ${mutedColor} !important;
    }
    .card, [class*="card"], .surface {
      background-color: ${cardColor} !important;
      border-color: ${borderColor} !important;
    }
    /* Remove wrong Tailwind colors */
    .bg-white, .bg-gray-50, .bg-gray-100, .bg-slate-50, .bg-slate-100 {
      background-color: ${bgColor} !important;
    }
    .text-black, .text-gray-900, .text-slate-900 {
      color: ${fgColor} !important;
    }
    .text-gray-500, .text-gray-600, .text-slate-500, .text-slate-600 {
      color: ${mutedColor} !important;
    }
    [class*="text-red"], [class*="text-blue"], [class*="text-green"], [class*="text-orange"], [class*="text-purple"], [class*="text-pink"] {
      color: ${primaryColor} !important;
    }
    [class*="bg-red"], [class*="bg-blue"], [class*="bg-green"], [class*="bg-orange"], [class*="bg-purple"], [class*="bg-pink"] {
      background-color: ${primaryColor} !important;
    }
  `

  const iframeContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ${brandCSS}
          ${cssContent || ''}
        </style>
      </head>
      <body>
        ${variant.html}
      </body>
    </html>
  `

  const handleCopyCode = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await navigator.clipboard.writeText(variant.html)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenPreview = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!allVariants || allVariants.length === 0) return
    
    setIsCreatingPreview(true)
    try {
      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: projectName || 'Untitled Project',
          clientName: clientName || 'Client',
          prompt: prompt || 'Design request',
          variants: allVariants.map(v => ({
            id: v.id,
            name: v.name,
            html: v.html,
            style: v.style,
          })),
          // Include brand colors for the preview
          brandCSS: brandCSS,
          tokens: tokens,
        }),
      })
      
      if (response.ok) {
        const { previewId } = await response.json()
        window.open(`/preview/${previewId}`, '_blank')
      }
    } catch (error) {
      console.error('Failed to create preview:', error)
    } finally {
      setIsCreatingPreview(false)
    }
  }

  const handleExportSVG = (e: React.MouseEvent) => {
    e.stopPropagation()
    downloadSVGFile(variant, tokens)
  }

  const style = styleMap[variant.style]

  return (
    <TooltipProvider>
      <div
        className={cn(
          'group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200',
          isSelected
            ? 'border-primary ring-2 ring-primary/30'
            : 'border-border hover:border-primary/60 hover:shadow-lg',
          onSelect && 'cursor-pointer'
        )}
        onClick={onSelect}
      >
        {/* Preview */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-t-xl m-1">
          <iframe
            ref={iframeRef}
            srcDoc={iframeContent}
            className="h-full w-full border-0 pointer-events-none"
            sandbox="allow-scripts"
            title={variant.name}
          />

          {/* Hover overlay with actions */}
          <div className="absolute inset-1 flex items-center justify-center gap-3 rounded-xl bg-background/80 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
            {allVariants && allVariants.length > 0 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="h-10 gap-2 rounded-xl px-4 text-xs font-semibold"
                    onClick={handleOpenPreview}
                    disabled={isCreatingPreview}
                  >
                    <ExternalLink className="h-4 w-4" />
                    {isCreatingPreview ? 'Creating...' : 'Preview'}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open shareable preview</TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-10 gap-2 rounded-xl px-4 text-xs font-medium"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Code2 className="h-4 w-4" />
                  )}
                  {copied ? 'Copied' : 'Code'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy HTML code</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-10 gap-2 rounded-xl px-4 text-xs font-medium"
                  onClick={handleExportSVG}
                >
                  <Download className="h-4 w-4" />
                  SVG
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export as SVG for Figma</TooltipContent>
            </Tooltip>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-border px-4 py-4">
          <span
            className={cn(
              'shrink-0 rounded-lg px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider',
              style.bg,
              style.text
            )}
          >
            {style.label}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-card-foreground">
              {variant.name}
            </p>
          </div>
        </div>

      </div>
    </TooltipProvider>
  )
}

interface VariantGridProps {
  variants: GeneratedVariant[]
  tokens: DesignTokens
  selectedVariant?: GeneratedVariant
  onSelectVariant?: (variant: GeneratedVariant) => void
  projectId?: string
  requestId?: string
  cssContent?: string
  projectName?: string
  clientName?: string
  prompt?: string
}

export function VariantGrid({
  variants,
  tokens,
  selectedVariant,
  onSelectVariant,
  projectId,
  requestId,
  cssContent,
  projectName,
  clientName,
  prompt,
}: VariantGridProps) {
  if (variants.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <Sparkles className="h-7 w-7 text-primary-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-foreground">No variants generated</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a prompt above to generate component variants
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {variants.length} variant{variants.length !== 1 ? 's' : ''} generated
        </p>
        <p className="text-sm text-muted-foreground">
          Select a variant to export
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {variants.map((variant) => (
          <VariantPreview
            key={variant.id}
            variant={variant}
            tokens={tokens}
            isSelected={selectedVariant?.id === variant.id}
            onSelect={() => onSelectVariant?.(variant)}
            projectId={projectId}
            requestId={requestId}
            cssContent={cssContent}
            allVariants={variants}
            projectName={projectName}
            clientName={clientName}
            prompt={prompt}
          />
        ))}
      </div>
    </div>
  )
}
