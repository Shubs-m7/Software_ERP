"use client"

import React from "react"
import { LucideIcon, SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-20 px-4 text-center animate-in fade-in zoom-in duration-500",
      className
    )}>
      <div className="h-24 w-24 rounded-[2.5rem] bg-muted/20 border border-border/40 flex items-center justify-center mb-6 shadow-inner relative group">
         <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] scale-110 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
         <Icon className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      
      <h3 className="text-2xl font-black tracking-tight text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm font-medium max-w-[300px] leading-relaxed mb-8">
        {description}
      </p>

      {action && (
        <Button 
          onClick={action.onClick}
          className="h-11 px-8 rounded-xl bg-primary shadow-xl shadow-primary/20 font-bold hover:scale-[1.05] active:scale-95 transition-all"
        >
          {action.label}
        </Button>
      )}
    </div>
  )
}
