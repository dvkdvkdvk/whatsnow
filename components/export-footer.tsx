'use client'

import * as React from 'react'
import { Check, Code2, Copy, Download, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { GeneratedVariant, DesignTokens } from '@/lib/store'
import { downloadSVGFile, generateApprovalLink } from '@/lib/figma-export'

interface ExportFooterProps {
  selectedVariant?: GeneratedVariant
  variants: GeneratedVariant[]
  tokens: DesignTokens
  projectId?: string
  requestId?: string
}

export function ExportFooter({
  selectedVariant,
  variants,
  tokens,
  projectId,
  requestId,
}: ExportFooterProps) {
  const [isShareOpen, setIsShareOpen] = React.useState(false)
  const [shareEnabled, setShareEnabled] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [copiedLink, setCopiedLink] = React.useState(false)

  const approvalLink =
    projectId && requestId ? generateApprovalLink(projectId, requestId) : ''

  const handleExportAll = () => {
    variants.forEach((variant) => {
      downloadSVGFile(variant, tokens)
    })
  }

  const handleExportSelected = () => {
    if (selectedVariant) {
      downloadSVGFile(selectedVariant, tokens)
    }
  }

  const handleCopyCode = async () => {
    if (selectedVariant) {
      await navigator.clipboard.writeText(selectedVariant.html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyLink = async () => {
    if (approvalLink) {
      await navigator.clipboard.writeText(approvalLink)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  return (
    <TooltipProvider>
      <div className="border-t border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side - Selection info */}
          <div className="flex items-center gap-3">
            {selectedVariant ? (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {selectedVariant.name}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm font-medium text-muted-foreground">
                Select a variant to export
              </p>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 rounded-xl px-4 font-medium"
                  onClick={handleCopyCode}
                  disabled={!selectedVariant}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-primary" />
                  ) : (
                    <Code2 className="h-4 w-4" />
                  )}
                  <span className="text-xs">{copied ? 'Copied' : 'Copy Code'}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy HTML to clipboard</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 rounded-xl px-4 font-medium"
                  onClick={handleExportSelected}
                  disabled={!selectedVariant}
                >
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Export SVG</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export selected variant as SVG for Figma</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 gap-2 rounded-xl px-4 font-medium"
                  onClick={handleExportAll}
                  disabled={variants.length === 0}
                >
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Export All</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export all variants as SVG files</TooltipContent>
            </Tooltip>

            <div className="mx-3 h-8 w-px bg-border" />

            <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    className="h-10 gap-2 rounded-xl px-5 font-semibold"
                    onClick={() => setIsShareOpen(true)}
                    disabled={!projectId || !requestId}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="text-xs">Share</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Generate client approval link</TooltipContent>
              </Tooltip>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Share with Client</DialogTitle>
                  <DialogDescription>
                    Generate a read-only preview link for your client to review
                    and approve the designs.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-4">
                  <div className="flex items-center justify-between rounded-xl border border-border p-5">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        Enable sharing
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Anyone with the link can view this design
                      </p>
                    </div>
                    <Switch
                      checked={shareEnabled}
                      onCheckedChange={setShareEnabled}
                    />
                  </div>

                  {shareEnabled && (
                    <div className="space-y-3">
                      <Label className="font-medium">Preview Link</Label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={approvalLink}
                          className="font-mono text-xs"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyLink}
                        >
                          {copiedLink ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsShareOpen(false)}
                  >
                    Close
                  </Button>
                  {shareEnabled && (
                    <Button 
                      onClick={() => window.open(approvalLink, '_blank')}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Preview
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
