"use client"

import * as React from "react"
import { Check, Building2, Truck, ParkingCircle, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore } from "@/store/use-app-store"
import { projectsData } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

export function ProjectSelector() {
  const { selectedProject, setSelectedProject } = useAppStore()
  const router = useRouter()

  const activeProjects = projectsData.filter(p => p.status === "Active")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-[200px] justify-between h-9 bg-muted/40 border-border/40 hover:bg-muted/60 rounded-xl px-3 transition-all"
        >
          <div className="flex items-center gap-2 truncate">
             <div className={cn(
               "h-5 w-5 rounded-md flex items-center justify-center shrink-0",
               selectedProject?.type === "PARKING" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : 
               selectedProject?.type === "BALU" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : 
               "bg-muted/30 text-muted-foreground"
             )}>
                {selectedProject?.type === "PARKING" ? <ParkingCircle className="h-3 w-3" /> : 
                 selectedProject?.type === "BALU" ? <Truck className="h-3 w-3" /> : 
                 <Building2 className="h-3 w-3" />}
             </div>
             <span className="text-xs font-bold truncate">
                {selectedProject?.name || "Select Project"}
             </span>
          </div>
          <ChevronDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-40" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[240px] p-2 rounded-2xl border-border/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 py-1.5">
          Switch Project Site
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/40 mx-2 mb-1" />
        <div className="space-y-1">
          {activeProjects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              onClick={() => {
                setSelectedProject(project)
                router.push("/dashboard")
              }}
              className={cn(
                "h-10 flex items-center gap-2 px-2 rounded-xl cursor-pointer transition-colors focus:bg-primary/10",
                selectedProject?.id === project.id && "bg-primary/5 text-primary"
              )}
            >
              <div className={cn(
                "h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                project.type === "PARKING" ? "bg-blue-600 text-white" : "bg-amber-500 text-white"
              )}>
                {project.type === "PARKING" ? <ParkingCircle className="h-3.5 w-3.5" /> : <Truck className="h-3.5 w-3.5" />}
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="font-bold text-[11px] truncate leading-none">{project.name}</span>
                <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-black mt-0.5">
                  {project.type} MODE
                </span>
              </div>
              {selectedProject?.id === project.id && (
                <Check className="ml-auto h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
