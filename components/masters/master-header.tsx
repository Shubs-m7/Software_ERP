import React from "react"
import { Plus, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { Module } from "@/lib/rbac"

interface MasterHeaderProps {
  title: string
  description: string
  icon: LucideIcon
  onCreateClick: () => void
  createButtonText?: string
  module?: Module
}

export function MasterHeader({
  title,
  description,
  icon: Icon,
  onCreateClick,
  createButtonText = "Create",
  module = "masters"
}: MasterHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
          {title}
        </h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {description}
        </p>
      </div>
      <PermissionGuard module={module} action="create">
        <Button 
          onClick={onCreateClick}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center gap-2 h-11 px-6 rounded-xl"
        >
          <Plus className="h-5 w-5" />
          {createButtonText}
        </Button>
      </PermissionGuard>
    </div>
  )
}
