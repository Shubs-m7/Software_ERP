"use client"

import React, { useEffect } from "react"
import { useAppStore } from "@/store/use-app-store"
import ParkingDashboard from "./parking/page"
import BaluDashboard from "./balu/page"
import { LayoutDashboard, MousePointer2, ShieldCheck, Sparkle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  const { businessType, selectedProject } = useAppStore()

  // Dynamic Rendering
  if (businessType === "PARKING") {
    return <ParkingDashboard />
  }

  if (businessType === "BALU") {
    return <BaluDashboard />
  }

  // Initial / Selection State
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-in fade-in duration-1000">
      <div className="relative">
         <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
         <div className="relative h-24 w-24 rounded-[2rem] bg-card border border-primary/20 flex items-center justify-center shadow-2xl">
            <LayoutDashboard className="h-10 w-10 text-primary" />
         </div>
         <div className="absolute -top-4 -right-4 h-10 w-10 rounded-full bg-background border border-border/40 flex items-center justify-center shadow-xl animate-bounce">
            <Sparkle className="h-5 w-5 text-amber-500 fill-amber-500" />
         </div>
      </div>

      <div className="text-center space-y-3 max-w-sm">
         <h1 className="text-3xl font-black tracking-tight text-foreground">
           Welcome to the <span className="text-primary italic">Enterprise</span> Hub.
         </h1>
         <p className="text-muted-foreground font-medium leading-relaxed">
           Please select an active project from the sidebar to view your localized metrics and analysis.
         </p>
      </div>

      <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary animate-pulse">
         <MousePointer2 className="h-4 w-4" />
         <span className="text-xs font-black uppercase tracking-widest">Awaiting Selection</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mt-8">
         <Card className="rounded-[2.5rem] border-primary/10 bg-card/10 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold">Secure Multi-Tenant Access</p>
               <p className="text-[10px] text-muted-foreground leading-relaxed">Your project view is automatically filtered based on your role and permissions.</p>
            </CardContent>
         </Card>
         <Card className="rounded-[2.5rem] border-primary/10 bg-card/10 backdrop-blur-md overflow-hidden">
            <CardContent className="p-8 flex flex-col items-center text-center gap-4">
               <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Sparkle className="h-6 w-6" />
               </div>
               <p className="text-sm font-bold">Real-time Data Integration</p>
               <p className="text-[10px] text-muted-foreground leading-relaxed">Analytical charts update instantly as transactions are posted in the field.</p>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
