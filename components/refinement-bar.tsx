'use client'

import * as React from 'react'
import { ArrowRight, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface RefinementBarProps {
  onSubmit: (prompt: string) => void
  isLoading?: boolean
  disabled?: boolean
  originalPrompt?: string
}

const refinementSuggestions = [
  { label: 'More minimal', prompt: 'Make it more minimal with less elements' },
  { label: 'Bolder CTAs', prompt: 'Make the call-to-action buttons more prominent' },
  { label: 'More whitespace', prompt: 'Add more whitespace and breathing room' },
  { label: 'Different layout', prompt: 'Try a different layout arrangement' },
  { label: 'Darker theme', prompt: 'Use a dark color scheme' },
  { label: 'Add imagery', prompt: 'Add placeholder areas for images' },
]

export function RefinementBar({ onSubmit, isLoading, disabled, originalPrompt }: RefinementBarProps) {
  const [prompt, setPrompt] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim())
      setPrompt('')
    }
  }

  const handleSuggestion = (suggestionPrompt: string) => {
    onSubmit(suggestionPrompt)
  }

  return (
    <div className="border-t border-border bg-card">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Refinement input */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground">Refine:</span>
            </div>
            <div
              className={cn(
                'flex flex-1 items-center gap-2 rounded-xl border bg-background px-4 py-2 transition-all duration-200',
                isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                disabled && 'opacity-50'
              )}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Describe changes you want to make..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled || isLoading}
                className={cn(
                  'flex-1 bg-transparent text-sm text-foreground outline-none',
                  'placeholder:text-muted-foreground',
                  'disabled:cursor-not-allowed'
                )}
              />
              <Button
                type="submit"
                size="sm"
                className="h-9 gap-2 rounded-xl px-5 font-semibold"
                disabled={!prompt.trim() || isLoading || disabled}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Refining</span>
                  </>
                ) : (
                  <>
                    <span>Apply</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Quick refinement suggestions */}
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick edits</span>
            <div className="flex items-center gap-2">
              {refinementSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => handleSuggestion(suggestion.prompt)}
                  disabled={isLoading || disabled}
                  className={cn(
                    'shrink-0 rounded-full border border-border bg-secondary px-4 py-2 text-xs font-medium text-secondary-foreground',
                    'transition-all duration-150 hover:border-primary hover:bg-primary/10',
                    'disabled:cursor-not-allowed disabled:opacity-50'
                  )}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
