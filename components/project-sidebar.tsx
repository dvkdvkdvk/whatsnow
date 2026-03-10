'use client'

import React from 'react'
import { Project, ComponentRequest } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Settings, Trash2, Upload, X, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

interface ProjectSidebarProps {
  projects: Project[]
  activeProject: Project | null
  activeRequest: ComponentRequest | null
  onCreateProject: (name: string, clientName: string) => void
  onSelectProject: (project: Project) => void
  onSelectRequest: (request: ComponentRequest) => void
  onDeleteProject: (id: string) => void
  onDeleteRequest: (projectId: string, requestId: string) => void
  onUpdateProject: (id: string, updates: Partial<Project>) => void
  onUpdateCSS: (css: string) => void
  onClearTokens: () => void
  onPasteCSS: (content: string, name: string) => void
  children: React.ReactNode
}

export function ProjectSidebar({
  projects,
  activeProject,
  activeRequest,
  onCreateProject,
  onSelectProject,
  onSelectRequest,
  onDeleteProject,
  onDeleteRequest,
  onUpdateProject,
  children,
}: ProjectSidebarProps) {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [projectName, setProjectName] = React.useState('')
  const [clientName, setClientName] = React.useState('')
  const [editName, setEditName] = React.useState('')
  const [editClientName, setEditClientName] = React.useState('')
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDraggingOver, setIsDraggingOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleCreateProject = () => {
    if (projectName.trim() && clientName.trim()) {
      onCreateProject(projectName, clientName)
      setProjectName('')
      setClientName('')
      setIsCreateOpen(false)
      toast.success('Project created')
    }
  }

  const openSettings = (project: Project) => {
    setEditName(project.name)
    setEditClientName(project.clientName)
    setIsSettingsOpen(true)
  }

  const handleSaveEdit = () => {
    if (activeProject && editName.trim() && editClientName.trim()) {
      onUpdateProject(activeProject.id, {
        name: editName,
        clientName: editClientName,
      })
      setIsSettingsOpen(false)
      toast.success('Project updated')
    }
  }

  const handleUploadVisual = async (file: File) => {
    if (!activeProject) {
      toast.error('Select a project first')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
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

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()

      if (data.url) {
        const currentVisuals = activeProject.visualReferences || []
        const newVisual = {
          id: Date.now().toString(),
          url: data.url,
          name: file.name,
          uploadedAt: new Date(),
        }

        onUpdateProject(activeProject.id, {
          visualReferences: [...currentVisuals, newVisual],
        })

        toast.success('Visual reference uploaded')
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeVisual = (visualId: string) => {
    if (!activeProject) return
    const updated = (activeProject.visualReferences || []).filter(v => v.id !== visualId)
    onUpdateProject(activeProject.id, { visualReferences: updated })
    toast.success('Visual removed')
  }

  // Drag and drop handlers for the upload zone
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)

    const files = Array.from(e.dataTransfer.files)
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await handleUploadVisual(file)
      }
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="h-full w-72 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Projects</h2>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Project Name</label>
                  <Input
                    placeholder="e.g., Website Redesign"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Client Name</label>
                  <Input
                    placeholder="e.g., Acme Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <Button onClick={handleCreateProject} className="w-full">
                  Create Project
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Projects list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {projects.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">
              No projects yet
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="space-y-0.5">
                <div
                  className={`group p-3 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                    activeProject?.id === project.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                  onClick={() => onSelectProject(project)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{project.clientName}</p>
                    <p className="text-xs text-muted-foreground truncate">{project.name}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        openSettings(project)
                      }}
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteProject(project.id)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Show requests/layouts under active project */}
                {activeProject?.id === project.id && project.requests.length > 0 && (
                  <div className="pl-4 space-y-0.5">
                    {project.requests.map((request) => (
                      <div
                        key={request.id}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer text-sm ${
                          activeRequest?.id === request.id
                            ? 'bg-muted text-foreground'
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                        }`}
                        onClick={() => onSelectRequest(request)}
                      >
                        <ChevronRight className="h-3 w-3" />
                        <span className="flex-1 truncate">{request.prompt.slice(0, 30)}...</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteRequest(project.id, request.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Visual references count for active project */}
        {activeProject && (
          <div className="p-3 border-t border-border">
            <button
              onClick={() => openSettings(activeProject)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <span className="text-xs text-muted-foreground">Visual References</span>
              <span className="text-xs font-medium">{activeProject.visualReferences?.length || 0}</span>
            </button>
          </div>
        )}
      </aside>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border shrink-0">
            <DialogTitle className="text-xl">Configure Project</DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Project details */}
            <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Project Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Project Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-2 bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Client Name</label>
                  <Input
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="mt-2 bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Visual references */}
            <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Visual References</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload screenshots to help AI match the design style
                  </p>
                </div>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {activeProject?.visualReferences?.length || 0} images
                </span>
              </div>

              {/* Thumbnails grid */}
              {activeProject?.visualReferences && activeProject.visualReferences.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {activeProject.visualReferences.map((visual) => (
                    <div key={visual.id} className="relative group aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-colors">
                      <img
                        src={visual.url}
                        alt={visual.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeVisual(visual.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-xs text-white truncate">{visual.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload dropzone with drag and drop */}
              <label 
                className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDraggingOver
                    ? 'border-primary bg-primary/10'
                    : isUploading 
                      ? 'border-primary/50 bg-primary/5' 
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {isUploading ? (
                  <>
                    <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors ${
                      isDraggingOver ? 'bg-primary/20' : 'bg-primary/10'
                    }`}>
                      <Upload className={`h-6 w-6 ${isDraggingOver ? 'text-primary' : 'text-primary'}`} />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium">
                        {isDraggingOver ? 'Drop images here' : 'Drop images here or click to upload'}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={isUploading}
                  onChange={(e) => {
                    const files = e.target.files
                    if (files) {
                      Array.from(files).forEach(file => handleUploadVisual(file))
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {/* Footer with save button */}
          <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
