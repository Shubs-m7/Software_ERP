"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type ProjectType = "TOLL" | "BALU"

export interface Project {
  name: string
  type: ProjectType
}

interface ProjectContextType {
  selectedProject: Project
  setSelectedProject: (project: Project) => void
  projects: Project[]
}

const mockProjects: Project[] = [
  { name: "Toll Project A", type: "TOLL" },
  { name: "Balu Site X", type: "BALU" },
]

const ProjectContext = createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProjectState] = useState<Project>(mockProjects[0])

  useEffect(() => {
    const saved = localStorage.getItem("active_project")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const found = mockProjects.find(p => p.name === parsed.name)
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (found) setSelectedProjectState(found)
      } catch (e) {
        console.error("Failed to load project", e)
      }
    }
  }, [])

  const setSelectedProject = (project: Project) => {
    setSelectedProjectState(project)
    localStorage.setItem("active_project", JSON.stringify(project))
  }

  return (
    <ProjectContext.Provider value={{ selectedProject, setSelectedProject, projects: mockProjects }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider")
  }
  return context
}
