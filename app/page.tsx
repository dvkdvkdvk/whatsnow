'use client'

import * as React from 'react'
import { ProjectSidebar } from '@/components/project-sidebar'
import { PromptBar } from '@/components/prompt-bar'
import { RefinementBar } from '@/components/refinement-bar'
import { VariantGrid } from '@/components/variant-preview'
import { ExportFooter } from '@/components/export-footer'
import { DropZone } from '@/components/drop-zone'
import { ScrollArea } from '@/components/ui/scroll-area'
import type {
  Project,
  ComponentRequest,
  GeneratedVariant,
  DesignTokens,
} from '@/lib/store'
import { createProject, createRequest, generateId } from '@/lib/store'
import { parseCSSVariables, parseJSONTokens, mergeTokens, cleanupTokens } from '@/lib/css-parser'
import { toast } from 'sonner'

export default function BrandDNAPage() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [activeProject, setActiveProject] = React.useState<Project | null>(null)
  const [activeRequest, setActiveRequest] = React.useState<ComponentRequest | null>(
    null
  )
  const [currentVariants, setCurrentVariants] = React.useState<GeneratedVariant[]>(
    []
  )
  const [selectedVariant, setSelectedVariant] =
    React.useState<GeneratedVariant | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [isRefining, setIsRefining] = React.useState(false)

  // Load projects from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('brand-dna-projects')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Convert date strings back to Date objects
        const restoredProjects = parsed.map((p: Project) => ({
          ...p,
          createdAt: new Date(p.createdAt),
          updatedAt: new Date(p.updatedAt),
          requests: p.requests.map((r: ComponentRequest) => ({
            ...r,
            createdAt: new Date(r.createdAt),
          })),
        }))
        setProjects(restoredProjects)
        if (restoredProjects.length > 0) {
          setActiveProject(restoredProjects[0])
        }
      } catch (e) {
        console.error('Failed to load projects:', e)
      }
    }
  }, [])

  // Save projects to localStorage on change
  React.useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('brand-dna-projects', JSON.stringify(projects))
    } else {
      localStorage.removeItem('brand-dna-projects')
    }
  }, [projects])

  const handleCreateProject = (name: string, clientName: string) => {
    const newProject = createProject(name, clientName)
    setProjects((prev) => [...prev, newProject])
    setActiveProject(newProject)
    setActiveRequest(null)
    setCurrentVariants([])
    setSelectedVariant(null)
  }

  const handleSelectProject = (project: Project) => {
    setActiveProject(project)
    setActiveRequest(null)
    setCurrentVariants([])
    setSelectedVariant(null)
  }

  const handleSelectRequest = (request: ComponentRequest) => {
    setActiveRequest(request)
    setCurrentVariants(request.variants)
    setSelectedVariant(null)
  }

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, ...updates, updatedAt: new Date() }
          : p
      )
    )

    if (activeProject?.id === projectId) {
      setActiveProject((prev) =>
        prev ? { ...prev, ...updates, updatedAt: new Date() } : null
      )
    }
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId))

    if (activeProject?.id === projectId) {
      setActiveProject(null)
      setActiveRequest(null)
      setCurrentVariants([])
      setSelectedVariant(null)
    }
  }

  const handleDeleteRequest = (projectId: string, requestId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              requests: p.requests.filter((r) => r.id !== requestId),
              updatedAt: new Date(),
            }
          : p
      )
    )

    if (activeProject?.id === projectId) {
      setActiveProject((prev) =>
        prev
          ? {
              ...prev,
              requests: prev.requests.filter((r) => r.id !== requestId),
              updatedAt: new Date(),
            }
          : null
      )
    }

    if (activeRequest?.id === requestId) {
      setActiveRequest(null)
      setCurrentVariants([])
      setSelectedVariant(null)
    }
  }

  const handleUpdateCSS = (css: string) => {
    if (!activeProject) return

    const tokens = cleanupTokens(parseCSSVariables(css))

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              cssContent: css,
              designTokens: tokens,
              updatedAt: new Date(),
            }
          : p
      )
    )

    setActiveProject((prev) =>
      prev
        ? {
            ...prev,
            cssContent: css,
            designTokens: tokens,
            updatedAt: new Date(),
          }
        : null
    )
  }

  const handleClearTokens = () => {
    if (!activeProject) return

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              cssContent: undefined,
              designTokens: {},
              updatedAt: new Date(),
            }
          : p
      )
    )

    setActiveProject((prev) =>
      prev
        ? {
            ...prev,
            cssContent: undefined,
            designTokens: {},
            updatedAt: new Date(),
          }
        : null
    )
  }

  const handlePasteCSS = (content: string, _name: string) => {
    if (!activeProject) return

    const tokens = cleanupTokens(parseCSSVariables(content))
    const colorCount = Object.keys(tokens.colors || {}).length
    const componentCount = Object.keys(tokens.components || {}).length

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              designTokens: mergeTokens(p.designTokens, tokens),
              cssContent: content,
              updatedAt: new Date(),
            }
          : p
      )
    )

    setActiveProject((prev) =>
      prev
        ? {
            ...prev,
            designTokens: mergeTokens(prev.designTokens, tokens),
            cssContent: content,
            updatedAt: new Date(),
          }
        : null
    )
    
    toast.success('CSS styles saved', {
      description: `Extracted ${colorCount} colors${componentCount > 0 ? ` and ${componentCount} components` : ''}`
    })
  }

  const processFiles = async (files: File[]): Promise<{ tokens: DesignTokens; uploadedFiles: Array<{ id: string; name: string; type: 'css' | 'json'; uploadedAt: Date; content: string }> }> => {
    let tokens: DesignTokens = {}
    const uploadedFiles: Array<{ id: string; name: string; type: 'css' | 'json'; uploadedAt: Date; content: string }> = []
    
    for (const file of files) {
      const content = await file.text()
      if (file.name.endsWith('.css')) {
        tokens = mergeTokens(tokens, cleanupTokens(parseCSSVariables(content)))
        uploadedFiles.push({
          id: generateId(),
          name: file.name,
          type: 'css',
          uploadedAt: new Date(),
          content,
        })
      } else if (file.name.endsWith('.json')) {
        tokens = mergeTokens(tokens, cleanupTokens(parseJSONTokens(content)))
        uploadedFiles.push({
          id: generateId(),
          name: file.name,
          type: 'json',
          uploadedAt: new Date(),
          content,
        })
      }
    }
    return { tokens, uploadedFiles }
  }

  const handleDropCreateProject = async (
    name: string,
    clientName: string,
    files: File[]
  ) => {
    const { tokens, uploadedFiles } = await processFiles(files)
    const newProject = createProject(name, clientName)
    newProject.designTokens = tokens
    newProject.uploadedFiles = uploadedFiles

    setProjects((prev) => [...prev, newProject])
    setActiveProject(newProject)
    setActiveRequest(null)
    setCurrentVariants([])
    setSelectedVariant(null)
  }

  const handleDropAddToProject = async (projectId: string, files: File[]) => {
    const { tokens, uploadedFiles: newFiles } = await processFiles(files)

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              designTokens: mergeTokens(p.designTokens, tokens),
              uploadedFiles: [...(p.uploadedFiles || []), ...newFiles],
              updatedAt: new Date(),
            }
          : p
      )
    )

    // If adding to active project, update reference
    if (activeProject?.id === projectId) {
      setActiveProject((prev) =>
        prev
          ? {
              ...prev,
              designTokens: mergeTokens(prev.designTokens, tokens),
              uploadedFiles: [...(prev.uploadedFiles || []), ...newFiles],
              updatedAt: new Date(),
            }
          : null
      )
    } else {
      // Switch to that project
      const project = projects.find((p) => p.id === projectId)
      if (project) {
        const updatedProject = {
          ...project,
          designTokens: mergeTokens(project.designTokens, tokens),
          uploadedFiles: [...(project.uploadedFiles || []), ...newFiles],
          updatedAt: new Date(),
        }
        setActiveProject(updatedProject)
        setActiveRequest(null)
        setCurrentVariants([])
        setSelectedVariant(null)
      }
    }
  }

  const handleGenerateVariants = async (
    prompt: string,
    type: 'component' | 'section' | 'page'
  ) => {
    if (!activeProject) return

    setIsLoading(true)
    setSelectedVariant(null)

    const styles: Array<'editorial' | 'action' | 'minimalist'> = ['editorial', 'action', 'minimalist']
    const styleNames = {
      editorial: 'The Editorial',
      action: 'The Action',
      minimalist: 'The Minimalist',
    }
    
    // Generate all 3 variants in parallel using AI
    const variantPromises = styles.map(async (style) => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            type,
            tokens: activeProject.designTokens,
            style,
            cssContent: activeProject.cssContent,
            screenshotUrl: activeProject.screenshotUrl, // Visual reference for AI
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('[v0] Generation failed:', errorData)
          throw new Error('Generation failed')
        }
        
        const { html } = await response.json()
        
        return {
          id: generateId(),
          name: `${styleNames[style]} ${type.charAt(0).toUpperCase() + type.slice(1)}`,
          description: `${style.charAt(0).toUpperCase() + style.slice(1)} style variant`,
          html,
          style,
          sectionType: detectSectionType(prompt),
        }
      } catch (error) {
        console.error(`[v0] Failed to generate ${style} variant:`, error)
        return null
      }
    })
    
    const results = await Promise.all(variantPromises)
    const variants = results.filter((v): v is GeneratedVariant => v !== null)

    // Create a new request
    const newRequest = createRequest(prompt, type)
    newRequest.variants = variants

    // Update the project with the new request
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              requests: [...p.requests, newRequest],
              updatedAt: new Date(),
            }
          : p
      )
    )

    // Update active project reference
    setActiveProject((prev) =>
      prev
        ? {
            ...prev,
            requests: [...prev.requests, newRequest],
            updatedAt: new Date(),
          }
        : null
    )

    setActiveRequest(newRequest)
    setCurrentVariants(variants)
    setIsLoading(false)
  }
  
  // Simple section type detection for SVG export
  const detectSectionType = (prompt: string): GeneratedVariant['sectionType'] => {
    const p = prompt.toLowerCase()
    if (p.includes('nav')) return 'navbar'
    if (p.includes('hero')) return 'hero'
    if (p.includes('feature')) return 'features'
    if (p.includes('pricing') || p.includes('price')) return 'pricing'
    if (p.includes('testimonial') || p.includes('review')) return 'testimonials'
    if (p.includes('contact')) return 'contact'
    if (p.includes('faq')) return 'faq'
    if (p.includes('cta') || p.includes('call to action')) return 'cta'
    if (p.includes('footer')) return 'footer'
    return 'hero'
  }

  const handleRefineVariants = async (refinementPrompt: string) => {
    if (!activeProject || !activeRequest) return

    setIsRefining(true)
    setSelectedVariant(null)

    // Generate new variants with the refinement context
    const combinedPrompt = `${activeRequest.prompt}. Refinement: ${refinementPrompt}`
    
    const styles: Array<'editorial' | 'action' | 'minimalist'> = ['editorial', 'action', 'minimalist']
    const styleNames = {
      editorial: 'The Editorial',
      action: 'The Action',
      minimalist: 'The Minimalist',
    }
    
    const variantPromises = styles.map(async (style) => {
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: combinedPrompt,
            type: activeRequest.type,
            tokens: activeProject.designTokens,
            style,
            cssContent: activeProject.cssContent,
          }),
        })
        
        if (!response.ok) throw new Error('Generation failed')
        
        const { html } = await response.json()
        
        return {
          id: generateId(),
          name: `${styleNames[style]} ${activeRequest.type.charAt(0).toUpperCase() + activeRequest.type.slice(1)}`,
          description: `${style.charAt(0).toUpperCase() + style.slice(1)} style variant`,
          html,
          style,
          sectionType: detectSectionType(combinedPrompt),
        }
      } catch (error) {
        console.error(`Failed to generate ${style} variant:`, error)
        return null
      }
    })
    
    const results = await Promise.all(variantPromises)
    const variants = results.filter((v): v is GeneratedVariant => v !== null)

    // Update the existing request with new variants
    const updatedRequest = {
      ...activeRequest,
      variants,
      prompt: combinedPrompt,
    }

    // Update projects state
    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              requests: p.requests.map((r) =>
                r.id === activeRequest.id ? updatedRequest : r
              ),
              updatedAt: new Date(),
            }
          : p
      )
    )

    // Update active project reference
    setActiveProject((prev) =>
      prev
        ? {
            ...prev,
            requests: prev.requests.map((r) =>
              r.id === activeRequest.id ? updatedRequest : r
            ),
            updatedAt: new Date(),
          }
        : null
    )

    setActiveRequest(updatedRequest)
    setCurrentVariants(variants)
    setIsRefining(false)
  }

  return (
    <DropZone
      projects={projects}
      onCreateProject={handleDropCreateProject}
      onAddToProject={handleDropAddToProject}
    >
      <div className="flex h-screen bg-background">
        <ProjectSidebar
          projects={projects}
          activeProject={activeProject}
          activeRequest={activeRequest}
          onSelectProject={handleSelectProject}
          onSelectRequest={handleSelectRequest}
          onCreateProject={handleCreateProject}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
          onDeleteRequest={handleDeleteRequest}
          onUpdateCSS={handleUpdateCSS}
          onClearTokens={handleClearTokens}
          onPasteCSS={handlePasteCSS}
        >
          <div className="flex flex-1 flex-col">
            {/* Top Bar */}
            <PromptBar
              onSubmit={handleGenerateVariants}
              isLoading={isLoading}
              disabled={!activeProject}
            />

            {/* Main Stage */}
            <ScrollArea className="flex-1 bg-background">
              {!activeProject ? (
                <div className="flex h-full flex-col items-center justify-center gap-10 px-6 py-24">
                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-primary">
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-primary-foreground"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <div className="text-center max-w-lg">
                    <h2 className="text-4xl font-bold text-foreground">
                      Create a project to get started
                    </h2>
                    <p className="mt-5 text-lg text-muted-foreground text-balance leading-relaxed">
                      Use the sidebar to create a new client project, then configure brand styles in the settings.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-secondary border border-border text-sm font-medium text-secondary-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      Scrape Website
                    </span>
                    <span className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-secondary border border-border text-sm font-medium text-secondary-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                      Paste CSS
                    </span>
                    <span className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-secondary border border-border text-sm font-medium text-secondary-foreground">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-500" />
                      Drop Files
                    </span>
                  </div>
                </div>
              ) : currentVariants.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-8 px-6 py-24">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      className="text-primary-foreground"
                    >
                      <polygon points="12 2 2 7 12 12 22 7 12 2" />
                      <polyline points="2 17 12 22 22 17" />
                      <polyline points="2 12 12 17 22 12" />
                    </svg>
                  </div>
                  <div className="text-center max-w-md">
                    <h2 className="text-3xl font-bold text-foreground">
                      Ready to generate for {activeProject.clientName}
                    </h2>
                    <p className="mt-4 text-muted-foreground text-balance leading-relaxed text-lg">
                      Describe the component, section, or page you want to create using the prompt bar above.
                    </p>
                  </div>
                </div>
              ) : (
                <VariantGrid
                  variants={currentVariants}
                  tokens={activeProject.designTokens}
                  selectedVariant={selectedVariant ?? undefined}
                  onSelectVariant={(v) => setSelectedVariant(v)}
                  projectId={activeProject.id}
                  requestId={activeRequest?.id}
                  cssContent={activeProject.cssContent}
                  projectName={activeProject.name}
                  clientName={activeProject.clientName}
                  prompt={activeRequest?.prompt}
                />
              )}
            </ScrollArea>

            {/* Refinement Bar - shows when there are results */}
            {activeProject && currentVariants.length > 0 && activeRequest && (
              <RefinementBar
                onSubmit={handleRefineVariants}
                isLoading={isRefining}
                originalPrompt={activeRequest.prompt}
              />
            )}

            {/* Footer */}
            {activeProject && currentVariants.length > 0 && (
              <ExportFooter
                selectedVariant={selectedVariant ?? undefined}
                variants={currentVariants}
                tokens={activeProject.designTokens}
                projectId={activeProject?.id}
                requestId={activeRequest?.id}
              />
            )}
          </div>
        </ProjectSidebar>
      </div>
    </DropZone>
  )
}
