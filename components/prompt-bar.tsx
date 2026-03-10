'use client'

import * as React from 'react'
import { ArrowRight, Loader2, Sparkles, Wand2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface PromptBarProps {
  onSubmit: (prompt: string, type: 'component' | 'section' | 'page') => void
  isLoading?: boolean
  disabled?: boolean
}

const suggestions = [
  { label: 'Hero Section', prompt: 'Hero section with headline and CTA', icon: 'layout' },
  { label: 'Pricing Table', prompt: 'Pricing section with three tiers', icon: 'pricing' },
  { label: 'Feature Grid', prompt: 'Features section with icons and descriptions', icon: 'grid' },
  { label: 'Footer', prompt: 'Footer with newsletter signup', icon: 'footer' },
  { label: 'Navigation', prompt: 'Navigation bar with logo and links', icon: 'nav' },
  { label: 'Testimonials', prompt: 'Testimonials section with quotes', icon: 'quote' },
]

export function PromptBar({ onSubmit, isLoading, disabled }: PromptBarProps) {
  const [prompt, setPrompt] = React.useState('')
  const [type, setType] = React.useState<'component' | 'section' | 'page'>('section')
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt.trim(), type)
      setPrompt('')
    }
  }

  const handleSuggestion = (suggestionPrompt: string) => {
    setPrompt(suggestionPrompt)
    inputRef.current?.focus()
  }

  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-5xl px-6 py-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main input row */}
          <div
            className={cn(
              'flex items-center gap-3 rounded-2xl border bg-background p-2 transition-all duration-200',
              isFocused ? 'border-primary ring-2 ring-primary/20' : 'border-border',
              disabled && 'opacity-50'
            )}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Wand2 className="h-5 w-5 text-primary-foreground" />
            </div>

            <input
              ref={inputRef}
              type="text"
              placeholder={disabled ? 'Create a client project to start generating...' : 'Describe what you want to generate...'}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled || isLoading}
              className={cn(
                'h-11 flex-1 bg-transparent text-sm text-foreground outline-none',
                'placeholder:text-muted-foreground',
                'disabled:cursor-not-allowed'
              )}
            />

            <Select
              value={type}
              onValueChange={(v) => setType(v as 'component' | 'section' | 'page')}
              disabled={disabled || isLoading}
            >
              <SelectTrigger className="h-11 w-[130px] rounded-xl text-xs font-medium">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="component">Component</SelectItem>
                <SelectItem value="section">Section</SelectItem>
                <SelectItem value="page">Full Page</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              className="h-11 gap-2 rounded-xl px-6 text-sm font-semibold"
              disabled={!prompt.trim() || isLoading || disabled}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Generating</span>
                </>
              ) : (
                <>
                  <span>Generate</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {/* Suggestions */}
          {!disabled && (
            <div className="flex items-center gap-4 overflow-x-auto pb-1">
              <span className="shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">Quick start</span>
              <div className="flex items-center gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.label}
                    type="button"
                    onClick={() => handleSuggestion(suggestion.prompt)}
                    disabled={isLoading}
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
          )}
        </form>
      </div>
    </div>
  )
}
