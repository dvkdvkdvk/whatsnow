'use client'

import * as React from 'react'
import {
  ChevronRight,
  FolderPlus,
  History,
  MoreHorizontal,
  Pencil,
  Plus,
  Settings,
  Trash2,
  FileCode,
  Globe,
  Loader2,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
} from '@/components/ui/sidebar'
import type { Project, ComponentRequest, DesignTokens } from '@/lib/store'

interface ProjectSidebarProps {
  projects: Project[]
  activeProject: Project | null
  activeRequest: ComponentRequest | null
  onSelectProject: (project: Project) => void
  onSelectRequest: (request: ComponentRequest) => void
  onCreateProject: (name: string, clientName: string) => void
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void
  onDeleteProject: (projectId: string) => void
  onDeleteRequest: (projectId: string, requestId: string) => void
  onUpdateCSS: (css: string) => void
  onClearTokens: () => void
  onPasteCSS: (content: string, name: string) => void

  children: React.ReactNode
}

export function ProjectSidebar({
  projects,
  activeProject,
  activeRequest,
  onSelectProject,
  onSelectRequest,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
  onDeleteRequest,
  onUpdateCSS,
  onClearTokens,
  onPasteCSS,

  children,
}: ProjectSidebarProps) {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [editingProject, setEditingProject] = React.useState<Project | null>(null)
  const [projectName, setProjectName] = React.useState('')
  const [clientName, setClientName] = React.useState('')
  const [editName, setEditName] = React.useState('')
  const [editClientName, setEditClientName] = React.useState('')
  const [scrapeUrl, setScrapeUrl] = React.useState('')
  const [isScrapingCss, setIsScrapingCss] = React.useState(false)
  const [isCapturingScreenshot, setIsCapturingScreenshot] = React.useState(false)
  const [screenshotUrl, setScreenshotUrl] = React.useState('')

  // Capture a screenshot of the client's website for visual reference
  const handleCaptureScreenshot = async () => {
    if (!scrapeUrl.trim()) return
    
    setIsCapturingScreenshot(true)
    try {
      const response = await fetch('/api/screenshot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        toast.error('Failed to capture screenshot', { description: data.error })
        return
      }
      
      if (data.screenshotUrl) {
        setScreenshotUrl(data.screenshotUrl)
        // Save to project
        if (activeProject) {
          onUpdateProject(activeProject.id, { 
            screenshotUrl: data.screenshotUrl,
            clientUrl: scrapeUrl 
          })
        }
        toast.success('Screenshot captured!', {
          description: 'Visual reference will be used for AI generation'
        })
      }
    } catch (error) {
      toast.error('Failed to capture screenshot', { description: 'Network error occurred' })
    } finally {
      setIsCapturingScreenshot(false)
    }
  }

  const handleScrapeCss = async () => {
    if (!scrapeUrl.trim()) return
    
    setIsScrapingCss(true)
    try {
      // Also capture screenshot in parallel
      handleCaptureScreenshot()
      
      const response = await fetch('/api/scrape-css', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        toast.error('Failed to scrape CSS', { description: data.error })
        return
      }
      
      if (data.css) {
        setCssContent(data.css)
        
        // Auto-save the extracted CSS
        onPasteCSS(data.css, 'scraped')
        
        // Build a summary message
        const { summary, tokens } = data
        const colorCount = summary.totalColors || tokens?.colors?.length || 0
        const fontCount = summary.totalFontFamilies || tokens?.fontFamilies?.length || 0
        const varCount = summary.cssVariables || 0
        
        toast.success('CSS imported and saved', {
          description: `Extracted ${colorCount} colors, ${fontCount} fonts, ${varCount} variables`
        })
      }
    } catch (error) {
      toast.error('Failed to scrape CSS', { description: 'Network error occurred' })
    } finally {
      setIsScrapingCss(false)
    }
  }

  const handleCreateProject = () => {
    if (projectName && clientName) {
      onCreateProject(projectName, clientName)
      setProjectName('')
      setClientName('')
      setIsCreateOpen(false)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setEditName(project.name)
    setEditClientName(project.clientName)
    setIsEditOpen(true)
  }

  const handleSaveEdit = () => {
    if (editingProject && editName && editClientName) {
      onUpdateProject(editingProject.id, {
        name: editName,
        clientName: editClientName,
      })
      setIsEditOpen(false)
      setEditingProject(null)
    }
  }

  const handleOpenSettings = () => {
    if (activeProject?.screenshotUrl) {
      setScreenshotUrl(activeProject.screenshotUrl)
    } else {
      setScreenshotUrl('')
    }
    if (activeProject?.clientUrl) {
      setScrapeUrl(activeProject.clientUrl)
    }
    setIsSettingsOpen(true)
  }

  const handleSaveCSS = () => {
    onUpdateCSS(cssContent)
  }

  const tokensToCSS = (tokens: DesignTokens): string => {
    let css = ':root {\n'
    if (tokens.colors) {
      Object.entries(tokens.colors).forEach(([key, value]) => {
        css += `  --${key}: ${value};\n`
      })
    }
    if (tokens.spacing) {
      Object.entries(tokens.spacing).forEach(([key, value]) => {
        css += `  --spacing-${key}: ${value};\n`
      })
    }
    if (tokens.typography) {
      Object.entries(tokens.typography).forEach(([key, value]) => {
        css += `  --font-${key}: ${value};\n`
      })
    }
    if (tokens.borderRadius) {
      Object.entries(tokens.borderRadius).forEach(([key, value]) => {
        css += `  --radius-${key}: ${value};\n`
      })
    }
    if (tokens.shadows) {
      Object.entries(tokens.shadows).forEach(([key, value]) => {
        css += `  --shadow-${key}: ${value};\n`
      })
    }
    css += '}'
    return css
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-sidebar-border bg-sidebar">
        <SidebarHeader className="border-b border-sidebar-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* OpenDXP Logo Mark */}
              <div className="relative h-7 w-7 flex-shrink-0">
                <div className="absolute inset-0 rounded-sm bg-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rounded-full bg-sidebar" />
                </div>
              </div>
              <span className="text-sm font-semibold text-sidebar-foreground tracking-tight">
                Generator
              </span>
            </div>
            <ThemeToggle />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between px-3">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Projects
              </span>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-card-foreground">New Project</DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                      Create a new project to organize your client's components
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="project-name" className="font-medium text-card-foreground">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Website Redesign"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="border-border bg-background rounded-lg"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="client-name" className="font-medium text-card-foreground">Client Name</Label>
                      <Input
                        id="client-name"
                        placeholder="Acme Corp"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="border-border bg-background rounded-lg"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateProject}
                      className="bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </SidebarGroupLabel>

            <SidebarGroupContent className="px-2">
              <SidebarMenu className="space-y-1">
                {projects.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                      <FolderPlus className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm font-semibold text-sidebar-foreground">
                      No projects yet
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Create your first project
                    </p>
                  </div>
                ) : (
                  projects.map((project) => (
                    <Collapsible
                      key={project.id}
                      defaultOpen={activeProject?.id === project.id}
                    >
                      <SidebarMenuItem className="mb-1">
                        <div className="group/item flex items-center">
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton
                              isActive={activeProject?.id === project.id}
                              onClick={() => onSelectProject(project)}
                              className={cn(
                                "group flex-1 rounded-lg transition-colors h-auto py-2.5",
                                activeProject?.id === project.id && "bg-primary/10"
                              )}
                            >
                              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-data-[state=open]:rotate-90" />
                              <div className="flex flex-col items-start gap-0.5">
                                <span className="text-sm font-medium text-sidebar-foreground">
                                  {project.clientName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {project.name}
                                </span>
                              </div>
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 opacity-0 text-muted-foreground hover:text-foreground group-hover/item:opacity-100"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-popover border-border">
                              <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Project
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Project
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card border-border">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete project?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the project "{project.name}" for {project.clientName} and all its requests. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onDeleteProject(project.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1 border-l border-border pl-3">
                            {project.requests.length === 0 ? (
                              <p className="py-3 text-xs text-muted-foreground italic">
                                No requests yet
                              </p>
                            ) : (
                              project.requests.map((request) => (
                                <SidebarMenuSubItem key={request.id}>
                                  <div className="group/request flex items-center">
                                    <SidebarMenuButton
                                      size="sm"
                                      isActive={activeRequest?.id === request.id}
                                      onClick={() => onSelectRequest(request)}
                                      className="flex-1"
                                    >
                                      <History className="h-3 w-3" />
                                      <span className="truncate text-xs">
                                        {request.prompt}
                                      </span>
                                    </SidebarMenuButton>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6 opacity-0 group-hover/request:opacity-100"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>Delete request?</AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will delete this request and all its generated variants.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() => onDeleteRequest(project.id, request.id)}
                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          >
                                            Delete
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </div>
                                </SidebarMenuSubItem>
                              ))
                            )}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  ))
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {activeProject && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Client Settings
                </span>
              </SidebarGroupLabel>
              <SidebarGroupContent className="px-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2 rounded-lg"
                  onClick={handleOpenSettings}
                >
                  <Settings className="h-4 w-4 text-primary" />
                  {activeProject.clientName} Settings
                  {activeProject.uploadedFiles && activeProject.uploadedFiles.length > 0 && (
                    <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-medium">
                      {activeProject.uploadedFiles.length} file{activeProject.uploadedFiles.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2" />

        {/* Edit Project Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Edit Project</DialogTitle>
              <DialogDescription>
                Update project and client information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-project-name" className="font-medium">Project Name</Label>
                <Input
                  id="edit-project-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-client-name" className="font-medium">Client Name</Label>
                <Input
                  id="edit-client-name"
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveEdit}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Project Settings Dialog */}
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] p-0">
            <DialogHeader className="shrink-0 p-6 pb-0">
              <DialogTitle className="text-xl font-bold">{activeProject?.clientName} Settings</DialogTitle>
              <DialogDescription>
                Configure brand styles and design tokens for {activeProject?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(85vh-100px)] px-6 pb-6">
              <div className="space-y-5">
                {/* Visual Reference Section */}
                <div className="rounded-xl border border-border p-5 bg-muted/50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Visual Reference</h3>
                      <p className="text-xs text-muted-foreground">Enter client website URL for AI to match style</p>
                    </div>
                  </div>
                  
                  {/* URL Import + Screenshot */}
                  <div className="flex gap-2 mb-3">
                    <Input
                      type="url"
                      placeholder="https://client-website.com"
                      value={scrapeUrl}
                      onChange={(e) => setScrapeUrl(e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && scrapeUrl.trim() && !isScrapingCss) {
                          handleScrapeCss()
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleScrapeCss}
                      disabled={!scrapeUrl.trim() || isScrapingCss || isCapturingScreenshot}
                      variant="default"
                    >
                      {(isScrapingCss || isCapturingScreenshot) ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Globe className="h-4 w-4 mr-2" />
                      )}
                      Import
                    </Button>
                  </div>
                  
                  {/* Screenshot Preview */}
                  {(screenshotUrl || activeProject?.screenshotUrl) && (
                    <div className="mt-3 rounded-lg border border-border overflow-hidden">
                      <img 
                        src={screenshotUrl || activeProject?.screenshotUrl} 
                        alt="Client website screenshot"
                        className="w-full h-32 object-cover object-top"
                      />
                      <div className="p-2 bg-muted/50 text-xs text-muted-foreground">
                        Visual reference captured - AI will match this style
                      </div>
                    </div>
                  )}
                </div>

                {/* Extracted Tokens Display */}
                {activeProject?.designTokens && (
                  Object.keys(activeProject.designTokens.colors || {}).length > 0 ||
                  Object.keys(activeProject.designTokens.typography || {}).length > 0 ||
                  Object.keys(activeProject.designTokens.spacing || {}).length > 0 ||
                  Object.keys(activeProject.designTokens.borderRadius || {}).length > 0 ||
                  Object.keys(activeProject.designTokens.shadows || {}).length > 0
                ) && (
                  <div className="rounded-xl border border-border p-4 bg-muted/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">Extracted Tokens</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClearTokens}
                        className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Colors */}
                    {activeProject.designTokens.colors && Object.keys(activeProject.designTokens.colors).length > 0 && (() => {
                      const colorEntries = Object.entries(activeProject.designTokens.colors)
                        .filter(([, v]) => !v.startsWith('var('))
                      return colorEntries.length > 0 ? (
                        <div>
                          <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                            Colors ({colorEntries.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {colorEntries.slice(0, 16).map(([name, value]) => (
                              <div
                                key={name}
                                className="h-7 w-7 rounded-lg border border-border cursor-pointer hover:scale-110 transition-transform shadow-sm"
                                style={{ background: value }}
                                title={`${name}: ${value}`}
                              />
                            ))}
                            {colorEntries.length > 16 && (
                              <div className="h-7 w-7 rounded-lg border border-border bg-secondary flex items-center justify-center">
                                <span className="text-[8px] font-semibold text-muted-foreground">+{colorEntries.length - 16}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null
                    })()}
                    
                    {/* Typography */}
                    {activeProject.designTokens.typography && Object.keys(activeProject.designTokens.typography).length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          Typography ({Object.keys(activeProject.designTokens.typography).length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(activeProject.designTokens.typography).slice(0, 8).map(([name, value]) => (
                            <div
                              key={name}
                              className="px-2 py-1 rounded-lg bg-secondary border border-border text-[10px] truncate max-w-[120px]"
                              title={`${name}: ${value}`}
                            >
                              {value.toString().split(',')[0]}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Spacing */}
                    {activeProject.designTokens.spacing && Object.keys(activeProject.designTokens.spacing).length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          Spacing ({Object.keys(activeProject.designTokens.spacing).length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(activeProject.designTokens.spacing).slice(0, 8).map(([name, value]) => (
                            <div
                              key={name}
                              className="px-2 py-1 rounded-lg bg-secondary border border-border text-[10px] font-mono"
                              title={name}
                            >
                              {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Border Radius */}
                    {activeProject.designTokens.borderRadius && Object.keys(activeProject.designTokens.borderRadius).length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          Border Radius ({Object.keys(activeProject.designTokens.borderRadius).length})
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {Object.entries(activeProject.designTokens.borderRadius).slice(0, 6).map(([name, value]) => (
                            <div
                              key={name}
                              className="h-7 w-7 bg-secondary border border-border flex items-center justify-center"
                              style={{ borderRadius: value }}
                              title={`${name}: ${value}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Shadows */}
                    {activeProject.designTokens.shadows && Object.keys(activeProject.designTokens.shadows).length > 0 && (
                      <div>
                        <p className="text-[10px] font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                          Shadows ({Object.keys(activeProject.designTokens.shadows).length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(activeProject.designTokens.shadows).slice(0, 4).map(([name, value]) => (
                            <div
                              key={name}
                              className="h-8 w-12 bg-secondary rounded-lg"
                              style={{ boxShadow: value }}
                              title={`${name}: ${value}`}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <SidebarRail />
      </Sidebar>

      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </SidebarProvider>
  )
}
