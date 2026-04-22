"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { usePermission } from "@/hooks/use-permission"
import { getModuleFromPath } from "@/lib/rbac"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { canView } = usePermission()
  
  const module = getModuleFromPath(pathname)

  // If no module mapping exists for this path, allow access (or could be 404)
  if (!module) return <>{children}</>

  if (!canView(module)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in zoom-in duration-500">
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
          <ShieldAlert className="h-16 w-16 text-rose-500" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h2 className="text-3xl font-black tracking-tight text-foreground uppercase">Access Denied</h2>
          <p className="text-muted-foreground font-medium">
            You do not have permission to access the <span className="text-foreground font-bold">{module.toUpperCase()}</span> module. 
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="rounded-xl px-8 border-border/40 hover:bg-muted/50 transition-all active:scale-95"
        >
          Go Back
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
