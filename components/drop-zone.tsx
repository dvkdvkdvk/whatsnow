'use client'

import * as React from 'react'
import { FileUp, FolderPlus, Check, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Project } from '@/lib/store'

interface DropZoneProps {
  projects: Project[]
  onCreateProject: (name: string, clientName: string, files: File[]) => void
  onAddToProject: (projectId: string, files: File[]) => void
  children: React.ReactNode
}

export function DropZone({
  projects,
  onCreateProject,
  onAddToProject,
  children,
}: DropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [droppedFiles, setDroppedFiles] = React.useState<File[]>([])
  const [mode, setMode] = React.useState<'select' | 'create'>('select')
  const [projectName, setProjectName] = React.useState('')
  const [clientName, setClientName] = React.useState('')
  const [selectedProjectId, setSelectedProjectId] = React.useState<string | null>(
    null
  )
  const dragCounter = React.useRef(0)

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const files = Array.from(e.dataTransfer.files).filter(
      (file) =>
        file.name.endsWith('.css') ||
        file.name.endsWith('.json') ||
        file.type === 'text/css' ||
        file.type === 'application/json'
    )

    if (files.length > 0) {
      setDroppedFiles(files)
      setIsModalOpen(true)
      // Default to create mode if no projects exist
      if (projects.length === 0) {
        setMode('create')
      } else {
        setMode('select')
      }
    }
  }

  const handleConfirm = () => {
    if (mode === 'create') {
      if (projectName && clientName) {
        onCreateProject(projectName, clientName, droppedFiles)
        setProjectName('')
        setClientName('')
      }
    } else {
      if (selectedProjectId) {
        onAddToProject(selectedProjectId, droppedFiles)
      }
    }
    setIsModalOpen(false)
    setDroppedFiles([])
    setSelectedProjectId(null)
  }

  const uniqueClients = React.useMemo(() => {
    const clientMap = new Map<string, Project[]>()
    projects.forEach((project) => {
      const existing = clientMap.get(project.clientName) || []
      clientMap.set(project.clientName, [...existing, project])
    })
    return clientMap
  }, [projects])

  const isValid =
    mode === 'create'
      ? projectName.trim() !== '' && clientName.trim() !== ''
      : selectedProjectId !== null

  return (
    <>
      <div
        className="relative flex h-full flex-1 flex-col"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {children}

        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md">
            <div className="flex flex-col items-center gap-6 rounded-3xl border-2 border-dashed border-primary bg-card p-20 shadow-2xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
                <FileUp className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground">
                  Drop your design files
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  CSS variables or JSON design tokens
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Client/Project Selection Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Design Files to Project</DialogTitle>
            <DialogDescription>
              {droppedFiles.length > 0 && (
                <span className="mt-3 flex flex-wrap gap-2">
                  {droppedFiles.map((file, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium"
                    >
                      <FileUp className="h-3.5 w-3.5 text-primary" />
                      {file.name}
                    </span>
                  ))}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {/* Mode Toggle */}
            <div className="mb-5 flex gap-3">
              <Button
                variant={mode === 'select' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 rounded-xl font-medium"
                onClick={() => setMode('select')}
                disabled={projects.length === 0}
              >
                Existing Client
              </Button>
              <Button
                variant={mode === 'create' ? 'default' : 'outline'}
                size="sm"
                className="flex-1 rounded-xl font-medium"
                onClick={() => setMode('create')}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                New Client
              </Button>
            </div>

            {mode === 'select' ? (
              <ScrollArea className="h-64">
                <div className="space-y-4">
                  {Array.from(uniqueClients.entries()).map(
                    ([clientName, clientProjects]) => (
                      <div key={clientName}>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {clientName}
                        </p>
                        <div className="space-y-2">
                          {clientProjects.map((project) => (
                              <button
                              key={project.id}
                              onClick={() => setSelectedProjectId(project.id)}
                              className={cn(
                                'flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all',
                                selectedProjectId === project.id
                                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                                  : 'border-border hover:border-primary/50 hover:bg-secondary'
                              )}
                            >
                              <div>
                                <p className="text-sm font-medium text-card-foreground">
                                  {project.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {project.requests.length} requests
                                </p>
                              </div>
                              {selectedProjectId === project.id && (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                                  <Check className="h-4 w-4 text-primary-foreground" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="new-client-name" className="font-medium">Client Name</Label>
                  <Input
                    id="new-client-name"
                    placeholder="Acme Corp"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-project-name" className="font-medium">Project Name</Label>
                  <Input
                    id="new-project-name"
                    placeholder="Website Redesign"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm} 
              disabled={!isValid}
            >
              {mode === 'create' ? 'Create Project' : 'Add to Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
