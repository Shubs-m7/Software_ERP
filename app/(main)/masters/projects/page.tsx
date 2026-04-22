"use client"

import React, { useState } from "react"
import { Plus, Edit2, Search, Filter, Briefcase, Calendar, ParkingCircle, Truck } from "lucide-react"
import { projectsData } from "@/lib/mock-data"
import { Project, ProjectFormValues } from "@/types/project"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { ProjectForm } from "./project-form"
import { cn } from "@/lib/utils"

export default function ProjectMasterPage() {
  const [projects, setProjects] = useState<Project[]>(projectsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingProject(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (project: Project) => {
    setEditingProject(project)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: ProjectFormValues) => {
    if (editingProject) {
      setProjects(prev =>
        prev.map(p => (p.id === editingProject.id ? { ...p, ...data } : p))
      )
    } else {
      const newProject: Project = {
        id: `p${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }
      setProjects(prev => [...prev, newProject])
    }
    setIsModalOpen(false)
  }

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Project/Site Master
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Define project types and assign them to operational companies.
          </p>
        </div>
        <Button 
          onClick={handleOpenCreateModal}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 h-11 px-6 rounded-xl"
        >
          <Plus className="h-5 w-5" />
          Create Project
        </Button>
      </div>

      {/* Stats/Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by project name..." 
            className="pl-11 h-12 bg-card/30 border-border/40 focus:border-primary/50 rounded-2xl transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 w-full border-border/40 bg-card/30 rounded-2xl flex items-center gap-2 hover:bg-accent/40">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <div className="h-12 w-24 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-2xl">
            <span className="text-primary font-bold text-lg">{filteredProjects.length}</span>
            <span className="text-[10px] text-primary/60 uppercase ml-1 font-semibold">Total</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-[2rem] border border-border/40 bg-card/30 backdrop-blur-md overflow-hidden shadow-2xl">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Project Name</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Type</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Start Date</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8 font-bold text-foreground">
                    {project.name}
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      project.type === "PARKING" 
                        ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" 
                        : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    )}>
                      {project.type === "PARKING" ? <ParkingCircle className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                      {project.type}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="h-3.5 w-3.5" />
                      {project.startDate}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                      project.status === "Active" 
                        ? "bg-emerald-500/10 text-emerald-500" 
                        : "bg-rose-500/10 text-rose-500"
                    )}>
                      {project.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                      onClick={() => handleOpenEditModal(project)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">
                  No projects found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Form Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2rem] shadow-3xl">
          <ProjectForm 
            initialData={editingProject}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
