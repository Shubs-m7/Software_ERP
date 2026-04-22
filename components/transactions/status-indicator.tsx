"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Lock, Clock, PencilLine, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

export type StatusType = "Locked" | "Pending" | "Edited"

interface StatusIndicatorProps {
  status: StatusType
  className?: string
}

export function StatusIndicator({ status, className }: StatusIndicatorProps) {
  const config = {
    Locked: {
      label: "Locked",
      icon: Lock,
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    Pending: {
      label: "Pending Change",
      icon: Clock,
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    Edited: {
      label: "Edited by Admin",
      icon: PencilLine,
      className: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    },
  }

  const { label, icon: Icon, className: statusClass } = config[status]

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "rounded-full px-2.5 py-1 flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-tight shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95",
        statusClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </Badge>
  )
}
