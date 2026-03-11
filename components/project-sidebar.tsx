'use client'

import * as React from 'react'
import { Plus, Settings, Trash2, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { Project, ComponentRequest } from '@/lib/store'
import { generateId } from '@/lib/store'

interface ProjectSidebarProps {
  projects: Project[]
  activeProject: Project | null
  activeRequest: ComponentRequest | null
  onCreateProject: (name: string, clientName: string) => void
  onSelectProject: (project: Project) => void
  onSelectRequest: (request: ComponentRequest) => void
  onDeleteProject: (projectId: string) => void
  onDeleteRequest: (projectId: string, requestId: string) => void
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void
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
}: ProjectSidebarProps) {
  const [newProjectName, setNewProjectName] = React.useState('')
  const [newClientName, setNewClientName] = React.useState('')
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [editName, setEditName] = React.useState('')
  const [editClientName, setEditClientName] = React.useState('')
  const [isUploading, setIsUploading] = React.useState(false)
  const [isDraggingOver, setIsDraggingOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (activeProject && isSettingsOpen) {
      setEditName(activeProject.name)
      setEditClientName(activeProject.clientName)
    }
  }, [activeProject, isSettingsOpen])

  const handleCreateProject = () => {
    if (!newProjectName.trim() || !newClientName.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    onCreateProject(newProjectName, newClientName)
    setNewProjectName('')
    setNewClientName('')
  }

  const handleSaveEdit = () => {
    if (!editName.trim() || !editClientName.trim()) {
      toast.error('Please fill in all fields')
      return
    }
    if (activeProject) {
      onUpdateProject(activeProject.id, {
        name: editName,
        clientName: editClientName,
      })
      setIsSettingsOpen(false)
      toast.success('Project updated')
    }
  }

  const handleUploadVisual = async (file: File) => {
    if (!activeProject) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-screenshot', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      if (data.url) {
        const currentVisuals = activeProject.visualReferences || []
        const newVisual = {
          id: generateId(),
          url: data.url,
          name: file.name,
          uploadedAt: new Date(),
        }

        onUpdateProject(activeProject.id, {
          visualReferences: [...currentVisuals, newVisual],
        })

        toast.success('Visual reference uploaded')
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
    const updated = (activeProject.visualReferences || []).filter((v) => v.id !== visualId)
    onUpdateProject(activeProject.id, { visualReferences: updated })
    toast.success('Visual removed')
  }

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDraggingOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          handleUploadVisual(file)
        }
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-background border-r border-border">
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-border">
        <h2 className="text-lg font-bold mb-3">Projects</h2>

        {/* Create new project form */}
        <div className="space-y-2">
          <Input
            placeholder="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateProject()
            }}
          />
          <Input
            placeholder="Client name"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            className="h-8 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateProject()
            }}
          />
          <Button onClick={handleCreateProject} size="sm" className="w-full h-8 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            New Project
          </Button>
        </div>
      </div>

      {/* Projects list */}
      <div className="flex-1 overflow-y-auto">
        {projects.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">No projects yet</div>
        ) : (
          <div className="space-y-1 p-2">
            {projects.map((project) => (
              <div key={project.id}>
                <button
                  onClick={() => onSelectProject(project)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeProject?.id === project.id
                      ? 'bg-primary/10 text-primary border border-primary/30'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="truncate">{project.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{project.clientName}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {activeProject?.id === project.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsSettingsOpen(true)
                          }}
                        >
                          <Settings className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteProject(project.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </button>

                {activeProject?.id === project.id && project.requests.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {project.requests.map((request) => (
                      <button
                        key={request.id}
                        onClick={() => onSelectRequest(request)}
                        className={`w-full text-left px-2 py-1 rounded text-xs transition-colors group ${
                          activeRequest?.id === request.id
                            ? 'bg-primary/20 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="truncate">{request.prompt.substring(0, 30)}...</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteRequest(project.id, request.id)
                            }}
                          >
                            <X className="h-2 w-2" />
                          </Button>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings dialog */}
      {activeProject && (
        <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
              <DialogTitle className="text-xl">Configure Project</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {/* Project info card */}
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Project Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Project Name
                    </label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-2 bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Client Name
                    </label>
                    <Input
                      value={editClientName}
                      onChange={(e) => setEditClientName(e.target.value)}
                      className="mt-2 bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Visual references section */}
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                      Visual References
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Upload screenshots to help AI match the design style
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {activeProject.visualReferences?.length || 0} images
                  </span>
                </div>

                {/* Thumbnails grid */}
                {activeProject.visualReferences && activeProject.visualReferences.length > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {activeProject.visualReferences.map((visual) => (
                      <div
                        key={visual.id}
                        className="relative group aspect-video rounded-lg overflow-hidden border-2 border-border hover:border-primary/50 transition-colors"
                      >
                        <img src={visual.url} alt={visual.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button size="sm" variant="destructive" onClick={() => removeVisual(visual.id)}>
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

                {/* Upload dropzone */}
                <div
                  className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    isDraggingOver
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploading ? (
                    <>
                      <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      <span className="text-sm font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-medium">Drop images here or click to upload</span>
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
                        for (let i = 0; i < files.length; i++) {
                          handleUploadVisual(files[i])
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Fixed footer with save button */}
            <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
