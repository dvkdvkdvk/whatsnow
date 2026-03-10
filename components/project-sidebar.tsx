'use client'

import * as React from 'react'
import {
  ChevronRight,
  FolderPlus,
  History,
  Pencil,
  Plus,
  Settings,
  Trash2,
  FileCode,
  Upload,
  X,
  Image as ImageIcon,
} from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { toast } from 'sonner'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import type { Project, ComponentRequest, VisualReference } from '@/lib/store'
import { generateId } from '@/lib/store'

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
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleOpenSettings = () => {
    setIsSettingsOpen(true)
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

  // Upload visual reference
  const handleUploadVisual = async (file: File) => {
    if (!activeProject) {
      toast.error('No project selected')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-screenshot', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.url) {
        const newVisual: VisualReference = {
          id: generateId(),
          url: data.url,
          name: file.name,
          uploadedAt: new Date(),
        }

        const updatedVisuals = [...(activeProject.visualReferences || []), newVisual]
        onUpdateProject(activeProject.id, { visualReferences: updatedVisuals })

        toast.success('Visual uploaded!', {
          description: 'AI will use this as design reference',
        })
      } else {
        toast.error('Upload failed', { description: data.error || 'Please try again' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed', { description: 'Network error' })
    } finally {
      setIsUploading(false)
    }
  }

  // Remove visual reference
  const handleRemoveVisual = (visualId: string) => {
    if (!activeProject) return

    const updatedVisuals = (activeProject.visualReferences || []).filter(
      (v) => v.id !== visualId
    )
    onUpdateProject(activeProject.id, { visualReferences: updatedVisuals })
    toast.success('Visual removed')
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          handleUploadVisual(file)
        }
      })
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCode className="h-4 w-4 text-primary" />
              </div>
              <h1 className="font-bold text-sm">OpenDXP</h1>
            </div>
            <ThemeToggle />
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Active Project Header */}
          {activeProject && (
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-sm truncate">{activeProject.clientName}</h2>
                  <p className="text-xs text-muted-foreground truncate">{activeProject.name}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={handleOpenSettings}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              {/* Visual References Preview */}
              {(activeProject.visualReferences?.length > 0 || activeProject.screenshotUrl) && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                  {activeProject.visualReferences?.map((visual) => (
                    <div
                      key={visual.id}
                      className="relative shrink-0 w-12 h-12 rounded border border-border overflow-hidden group"
                    >
                      <img
                        src={visual.url}
                        alt={visual.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {activeProject.screenshotUrl && !activeProject.visualReferences?.length && (
                    <div className="relative shrink-0 w-12 h-12 rounded border border-border overflow-hidden">
                      <img
                        src={activeProject.screenshotUrl}
                        alt="Reference"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Projects List */}
          <SidebarGroup>
            <div className="flex items-center justify-between px-4 py-2">
              <SidebarGroupLabel className="p-0">Projects</SidebarGroupLabel>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="project-name">Project Name</Label>
                      <Input
                        id="project-name"
                        placeholder="Website Redesign"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="client-name">Client Name</Label>
                      <Input
                        id="client-name"
                        placeholder="Acme Corp"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateProject} disabled={!projectName || !clientName}>
                      Create Project
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <SidebarGroupContent>
              <SidebarMenu>
                {projects.map((project) => (
                  <SidebarMenuItem key={project.id}>
                    <Collapsible defaultOpen={activeProject?.id === project.id}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={activeProject?.id === project.id}
                          className="cursor-pointer"
                          onClick={() => onSelectProject(project)}
                        >
                          <FolderPlus className="h-4 w-4" />
                          <span className="truncate">{project.clientName}</span>
                          <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {/* Generated Layouts */}
                          {project.requests && project.requests.length > 0 ? (
                            project.requests.map((request) => (
                              <SidebarMenuSubItem key={request.id}>
                                <button
                                  className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-xs hover:bg-muted/50 ${
                                    activeRequest?.id === request.id ? 'bg-muted' : ''
                                  }`}
                                  onClick={() => onSelectRequest(request)}
                                >
                                  <History className="h-3 w-3 shrink-0" />
                                  <span className="truncate">{request.prompt.substring(0, 25)}...</span>
                                </button>
                              </SidebarMenuSubItem>
                            ))
                          ) : (
                            <SidebarMenuSubItem>
                              <span className="text-xs text-muted-foreground px-2">No layouts yet</span>
                            </SidebarMenuSubItem>
                          )}

                          {/* Actions */}
                          <SidebarMenuSubItem>
                            <div className="flex items-center gap-1 px-2 pt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleEditProject(project)}
                              >
                                <Pencil className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will delete &quot;{project.name}&quot; and all its layouts.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onDeleteProject(project.id)}
                                      className="bg-destructive"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </SidebarMenuSubItem>
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </SidebarMenuItem>
                ))}

                {projects.length === 0 && (
                  <div className="px-4 py-8 text-center">
                    <p className="text-sm text-muted-foreground">No projects yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setIsCreateOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter />
        <SidebarRail />
      </Sidebar>

      {/* Client Settings Modal */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {activeProject?.clientName} Settings
            </DialogTitle>
            <DialogDescription>
              Upload visual references for AI to match the design style
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4">
            {/* Upload Area */}
            <div
              className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    Array.from(files).forEach((file) => handleUploadVisual(file))
                  }
                  e.target.value = ''
                }}
              />

              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">
                    {isUploading ? 'Uploading...' : 'Drop images here'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or{' '}
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      browse files
                    </button>
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB each</p>
              </div>
            </div>

            {/* Visual References Grid */}
            {activeProject && (activeProject.visualReferences?.length > 0 || activeProject.screenshotUrl) && (
              <div>
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Visual References ({activeProject.visualReferences?.length || 1})
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {activeProject.visualReferences?.map((visual) => (
                    <div
                      key={visual.id}
                      className="relative group rounded-lg border border-border overflow-hidden aspect-video"
                    >
                      <img
                        src={visual.url}
                        alt={visual.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => handleRemoveVisual(visual.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-xs text-white truncate">{visual.name}</p>
                      </div>
                    </div>
                  ))}

                  {/* Legacy single screenshot support */}
                  {activeProject.screenshotUrl && !activeProject.visualReferences?.length && (
                    <div className="relative group rounded-lg border border-border overflow-hidden aspect-video">
                      <img
                        src={activeProject.screenshotUrl}
                        alt="Reference"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8"
                          onClick={() => onUpdateProject(activeProject.id, { screenshotUrl: '' })}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* No visuals message */}
            {activeProject && !activeProject.visualReferences?.length && !activeProject.screenshotUrl && (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No visual references yet</p>
                <p className="text-xs">Upload screenshots of the client website for AI to match the style</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Project Name</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="edit-client">Client Name</Label>
              <Input
                id="edit-client"
                value={editClientName}
                onChange={(e) => setEditClientName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <main className="flex-1">{children}</main>
    </SidebarProvider>
  )
}
