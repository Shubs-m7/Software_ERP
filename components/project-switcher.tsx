"use client"

import * as React from "react"
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

// Fallback icons if lucide ones fail
import { ParkingCircle as ParkingCircleIcon, Truck as TruckIcon, Building2 as BuildingIcon, ChevronDown, Check as CheckIcon } from "lucide-react"

export function ProjectSwitcher() {
  const { selectedProject, setSelectedProject, user } = useAppStore()
  const router = useRouter()

  const activeProjects = React.useMemo(() => {
    if (!user) return projectsData.filter(p => p.status === "Active")
    
    // Phase 8: Site-Restricted Visibility Logic
    if (user?.allowedProjectIds && user.allowedProjectIds.length > 0) {
      return projectsData.filter(p => p.status === "Active" && user.allowedProjectIds.includes(p.id))
    }
    
    // Super Admin or unrestricted user
    return projectsData.filter(p => p.status === "Active")
  }, [user])

  const isLockdown = !!(user && user?.allowedProjectIds?.length === 1)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLockdown}>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between h-14 bg-card/40 border-border/40 hover:bg-card/60 rounded-xl px-4 transition-all",
            isLockdown && "opacity-80 cursor-default"
          )}
        >
          <div className="flex items-center gap-3">
             <div className={cn(
               "h-8 w-8 rounded-lg flex items-center justify-center transition-all",
               selectedProject?.type === "PARKING" ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : 
               selectedProject?.type === "BALU" ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : 
               "bg-muted/30 text-muted-foreground"
             )}>
                {selectedProject?.type === "PARKING" ? <ParkingCircleIcon className="h-4 w-4" /> : 
                 selectedProject?.type === "BALU" ? <TruckIcon className="h-4 w-4" /> : 
                 <BuildingIcon className="h-4 w-4" />}
             </div>
             <div className="flex flex-col items-start gap-0.5 max-w-[150px]">
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground leading-none">
                  {selectedProject?.type ? `${selectedProject.type} Mode` : "Select Project"}
                </span>
                <span className="text-sm font-bold truncate leading-none">
                  {selectedProject?.name || "Select Active Site"}
                </span>
             </div>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] p-2 rounded-2xl border-border/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 px-4 py-2">
          Project Inventory
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
                "h-12 flex items-center gap-3 px-3 rounded-xl cursor-pointer transition-all focus:bg-primary focus:text-primary-foreground group",
                selectedProject?.id === project.id && "bg-primary/5 border border-primary/10"
              )}
            >
              <div className={cn(
                "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                project.type === "PARKING" ? "bg-blue-600 text-white shadow-md shadow-blue-500/10 group-focus:bg-white group-focus:text-blue-600" : "bg-amber-500 text-white shadow-md shadow-amber-500/10 group-focus:bg-white group-focus:text-amber-500"
              )}>
                {project.type === "PARKING" ? <ParkingCircleIcon className="h-4 w-4" /> : <TruckIcon className="h-4 w-4" />}
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="font-bold text-sm truncate leading-none">{project.name}</span>
                <span className="text-[10px] uppercase tracking-tighter opacity-70 font-black mt-1">
                  {project.type} SECTOR
                </span>
              </div>
              {selectedProject?.id === project.id && (
                <CheckIcon className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
