"use client"

import React, { useState, useEffect } from "react"
import { BaluStatsCard } from "@/components/balu/balu-stats-card"
import { DispatchTrendChart, BillingVsCollectionChart } from "@/components/balu/balu-charts"
import { baluDashboardData } from "@/lib/mock-data"
import { CalendarIcon, Download, SlidersHorizontal, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function BaluPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            Balu Site Dashboard
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20">
              Active Project
            </span>
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 border-r pr-3 border-border/40">
              <MapPin className="h-4 w-4" />
              Site #104 - Gandhinagar
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="h-4 w-4" />
              April 18, 2026
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-background border-border/40 hover:bg-muted font-medium">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="bg-background border-border/40 hover:bg-muted font-medium">
            <Download className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-lg shadow-violet-500/20">
            Export MIS
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-2xl bg-card/20 border border-violet-500/5 shadow-inner" />
          ))
        ) : (
          baluDashboardData.stats.map((stat) => (
            <BaluStatsCard 
              key={stat.title}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              change={stat.change}
              trend={stat.trend as "up" | "down"}
            />
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-card/20 border border-violet-500/5 shadow-inner" />
            <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-card/20 border border-violet-500/5 shadow-inner" />
          </>
        ) : (
          <>
            <DispatchTrendChart data={baluDashboardData.dispatchTrend} />
            <BillingVsCollectionChart data={baluDashboardData.billingVsCollection} />
          </>
        )}
      </div>

      {/* Footer / Context */}
      <div className="rounded-2xl border border-border/40 bg-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center">
            <SlidersHorizontal className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-semibold">Operational Context</p>
            <p className="text-xs text-muted-foreground">Showing data for the current work shift (08:00 AM - 08:00 PM)</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold">
              U{i}
            </div>
          ))}
          <div className="h-8 w-8 rounded-full border-2 border-background bg-violet-100 flex items-center justify-center text-[10px] font-bold text-violet-600">
            +5
          </div>
        </div>
      </div>
    </div>
  )
}
