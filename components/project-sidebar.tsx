'use client'

import React from 'react'
import { Project } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Plus, Settings, Trash2, Upload, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface ProjectSidebarProps {
  projects: Project[]
  activeProject: Project | null
  onCreateProject: (name: string, clientName: string) => void
  onSelectProject: (project: Project) => void
  onDeleteProject: (id: string) => void
  onUpdateProject: (id: string, updates: Partial<Project>) => void
}

export function ProjectSidebar({
  projects,
  activeProject,
  onCreateProject,
  onSelectProject,
  onDeleteProject,
  onUpdateProject,
}: ProjectSidebarProps) {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [projectName, setProjectName] = React.useState('')
  const [clientName, setClientName] = React.useState('')
  const [editingProject, setEditingProject] = React.useState<Project | null>(null)
  const [editName, setEditName] = React.useState('')
  const [editClientName, setEditClientName] = React.useState('')
  const [isUploading, setIsUploading] = React.useState(false)
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

  const handleSaveEdit = () => {
    if (editingProject && editName.trim() && editClientName.trim()) {
      onUpdateProject(editingProject.id, {
        name: editName,
        clientName: editClientName,
      })
      setIsSettingsOpen(false)
      setEditingProject(null)
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
        throw new Error('Upload failed')
      }

      const data = await response.json()

      if (data.url) {
        const newVisuals = [...(activeProject.visualReferences || [])]
        newVisuals.push({
          id: Date.now().toString(),
          url: data.url,
          name: file.name,
          uploadedAt: new Date(),
        })

        onUpdateProject(activeProject.id, {
          visualReferences: newVisuals,
        })

        toast.success('Visual reference uploaded')
      } else {
        throw new Error(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed', {
        description: 'Please try again',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeVisual = (projectId: string, visualId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      const updated = project.visualReferences.filter(v => v.id !== visualId)
      onUpdateProject(projectId, { visualReferences: updated })
      toast.success('Visual removed')
    }
  }

  return (
    <aside className="h-full w-80 border-r border-border bg-background flex flex-col">
      {/* Header with create button */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="default">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  placeholder="e.g., Q1 Campaign"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Client Name</label>
                <Input
                  placeholder="e.g., Acme Corp"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="mt-1"
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
          <div className="p-4 text-center text-sm text-muted-foreground">
            No projects yet. Create one to get started.
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                activeProject?.id === project.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => onSelectProject(project)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate text-sm">{project.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{project.clientName}</p>
                </div>
                <div className="flex gap-1">
                  {activeProject?.id === project.id && (
                    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingProject(project)
                            setEditName(project.name)
                            setEditClientName(project.clientName)
                          }}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 gap-0">
                        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
                          <DialogTitle className="text-xl">Configure Project</DialogTitle>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                          {/* Project info card */}
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

                          {/* Visual references section */}
                          <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Visual References</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Upload screenshots to help AI match the design style
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {project.visualReferences?.length || 0} images
                              </span>
                            </div>

                            {/* Thumbnails grid */}
                            {project.visualReferences && project.visualReferences.length > 0 && (
                              <div className="grid grid-cols-3 gap-3">
                                {project.visualReferences.map((visual) => (
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
                                        onClick={() => removeVisual(project.id, visual.id)}
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

                            {/* Upload dropzone */}
                            <label 
                              className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                                isUploading 
                                  ? 'border-primary/50 bg-primary/5' 
                                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }`}
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
                            </label>
                          </div>
                        </div>

                        {/* Fixed footer with save button */}
                        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
                          <Button variant="outline" onClick={() => setIsSettingsOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveEdit}>
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteProject(project.id)
                      toast.success('Project deleted')
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
