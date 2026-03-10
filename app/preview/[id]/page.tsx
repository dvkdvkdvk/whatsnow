'use client'

import * as React from 'react'
import { use } from 'react'
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Monitor, Tablet, Smartphone, Share2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

type DeviceType = 'desktop' | 'tablet' | 'mobile'

interface PreviewData {
  projectName: string
  clientName: string
  prompt: string
  variants: Array<{
    id: string
    name: string
    html: string
    style: string
  }>
  brandCSS?: string
  tokens?: Record<string, unknown>
}

const deviceConfig: Record<DeviceType, { width: string; icon: typeof Monitor; label: string }> = {
  desktop: { width: '100%', icon: Monitor, label: 'Desktop' },
  tablet: { width: '768px', icon: Tablet, label: 'Tablet' },
  mobile: { width: '390px', icon: Smartphone, label: 'Mobile' },
}

export default function PublicPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [data, setData] = React.useState<PreviewData | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [device, setDevice] = React.useState<DeviceType>('desktop')
  const [isApproveOpen, setIsApproveOpen] = React.useState(false)
  const [feedback, setFeedback] = React.useState('')
  const [isApproved, setIsApproved] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)

  React.useEffect(() => {
    async function loadPreview() {
      try {
        const response = await fetch(`/api/preview?id=${encodeURIComponent(id)}`)
        if (!response.ok) {
          const err = await response.json()
          setError(err.error || 'Failed to load preview')
          return
        }
        const previewData = await response.json()
        setData(previewData)
      } catch (e) {
        setError('Failed to load preview')
      } finally {
        setLoading(false)
      }
    }
    loadPreview()
  }, [id])

  const variants = data?.variants || []
  const currentVariant = variants[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : variants.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < variants.length - 1 ? prev + 1 : 0))
  }

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [variants.length])

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const styleMap: Record<string, { label: string; bg: string; text: string }> = {
    editorial: { label: 'Editorial', bg: 'bg-amber-100', text: 'text-amber-800' },
    action: { label: 'Action', bg: 'bg-emerald-100', text: 'text-emerald-800' },
    minimalist: { label: 'Minimal', bg: 'bg-sky-100', text: 'text-sky-800' },
  }

  const handleApprove = () => {
    setIsApproved(true)
    setIsApproveOpen(false)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#fafafa' }}>
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 mx-auto mb-4" />
          <p className="text-sm" style={{ color: '#737373' }}>Loading preview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#fafafa' }}>
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-semibold mb-2" style={{ color: '#0a0a0a' }}>Preview Not Found</h1>
          <p className="mb-6" style={{ color: '#737373' }}>
            {error}. The preview may have expired or the link may be incorrect.
          </p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!data || variants.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#fafafa' }}>
        <div className="text-center">
          <h1 className="text-2xl font-semibold" style={{ color: '#0a0a0a' }}>No variants found</h1>
          <p className="mt-2" style={{ color: '#737373' }}>
            This preview has no generated variants.
          </p>
        </div>
      </div>
    )
  }

  const style = styleMap[currentVariant?.style] || styleMap.editorial

  // Build brand CSS from stored data - apply with !important to override everything
  const brandCSS = data?.brandCSS || ''
  
  const iframeContent = currentVariant ? `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          * { box-sizing: border-box; }
          body { margin: 0; padding: 0; min-height: 100vh; }
        </style>
      </head>
      <body>
        ${currentVariant.html}
        <style>
          /* Brand overrides - applied last for highest priority */
          ${brandCSS}
        </style>
      </body>
    </html>
  ` : ''

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col" style={{ background: '#f5f5f5' }}>
        {/* Top bar */}
        <header className="flex items-center justify-between border-b bg-white px-4 py-3" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-center gap-4">
            {/* Project info */}
            <div>
              <div className="flex items-center gap-2 text-xs" style={{ color: '#737373' }}>
                <span>{data.clientName}</span>
                <span>/</span>
                <span>{data.projectName}</span>
              </div>
              <p className="text-sm font-medium truncate max-w-[300px]" style={{ color: '#404040' }}>
                {data.prompt}
              </p>
            </div>

            {/* Variant info */}
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider',
                  style.bg,
                  style.text
                )}
              >
                {style.label}
              </span>
              <h1 className="text-sm font-medium" style={{ color: '#0a0a0a' }}>
                {currentVariant?.name}
              </h1>
            </div>
          </div>

          {/* Center - Device toggle */}
          <div className="flex items-center gap-1 rounded-lg border p-1" style={{ borderColor: '#e5e5e5', background: '#fafafa' }}>
            {(Object.keys(deviceConfig) as DeviceType[]).map((deviceType) => {
              const config = deviceConfig[deviceType]
              const Icon = config.icon
              return (
                <Tooltip key={deviceType}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setDevice(deviceType)}
                      className={cn(
                        'flex h-8 items-center gap-2 rounded-md px-3 text-xs font-medium transition-all',
                        device === deviceType
                          ? 'bg-white shadow-sm'
                          : 'hover:bg-white/50'
                      )}
                      style={{ color: device === deviceType ? '#0a0a0a' : '#737373' }}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden md:inline">{config.label}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>{config.label}</TooltipContent>
                </Tooltip>
              )
            })}
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-8 gap-2"
                >
                  {linkCopied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Share2 className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">{linkCopied ? 'Copied!' : 'Share'}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy shareable link</TooltipContent>
            </Tooltip>

            {isApproved ? (
              <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700" disabled>
                <Check className="mr-1.5 h-4 w-4" />
                Approved
              </Button>
            ) : (
              <Button size="sm" className="h-8" onClick={() => setIsApproveOpen(true)}>
                <Check className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">Approve</span>
              </Button>
            )}
          </div>
        </header>

        {/* Preview area */}
        <div className="flex-1 overflow-auto flex justify-center" style={{ background: '#f5f5f5' }}>
          <div 
            className="h-full bg-white shadow-lg transition-all duration-300"
            style={{ width: deviceConfig[device].width, maxWidth: '100%' }}
          >
            <iframe
              srcDoc={iframeContent}
              className="h-full w-full border-0"
              sandbox="allow-scripts"
              title={currentVariant?.name}
            />
          </div>
        </div>

        {/* Bottom variant selector */}
        <footer className="border-t bg-white px-4 py-3" style={{ borderColor: '#e5e5e5' }}>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center justify-center gap-2 flex-1 px-4 overflow-x-auto">
              {variants.map((variant, index) => {
                return (
                  <button
                    key={variant.id}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all whitespace-nowrap',
                      currentIndex === index
                        ? 'border-neutral-900 bg-neutral-900 text-white'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                    )}
                  >
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full flex-shrink-0',
                        variant.style === 'editorial' && 'bg-amber-500',
                        variant.style === 'action' && 'bg-emerald-500',
                        variant.style === 'minimalist' && 'bg-sky-500'
                      )}
                    />
                    <span className="hidden sm:inline">{variant.name}</span>
                    <span className="sm:hidden">{index + 1}</span>
                    {currentIndex === index && <Check className="h-3 w-3 ml-1" />}
                  </button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-center text-[10px] mt-2" style={{ color: '#a3a3a3' }}>
            Use arrow keys to navigate
          </p>
        </footer>

        {/* Approval Dialog */}
        <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Design</DialogTitle>
              <DialogDescription>
                You are about to approve &quot;{currentVariant?.name}&quot;. Add any feedback
                or notes for the design team.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <Textarea
                placeholder="Optional feedback or notes..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApproveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApprove}>
                <Check className="mr-2 h-4 w-4" />
                Confirm Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}
