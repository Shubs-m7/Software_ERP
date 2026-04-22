"use client"

import React, { useState, useEffect } from "react"
import { StatsCard } from "@/components/parking/stats-card"
import { ParkingCharts } from "@/components/parking/charts"
import { parkingDashboardData } from "@/lib/mock-data"
import { CalendarIcon, Download, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function ParkingPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Parking Collection Dashboard</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 border-r pr-3 border-border/40">
              <CalendarIcon className="h-4 w-4" />
              April 18, 2026
            </span>
            <span className="flex items-center gap-1.5">
              <RefreshCcw className="h-3 w-3 animate-spin-slow" />
              Live Data Synced
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-background/50 border-border/40 hover:bg-muted font-semibold">
            <Download className="h-4 w-4 mr-2" />
            Report
          </Button>
          <Button size="sm" className="font-semibold shadow-lg shadow-primary/10">
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] w-full rounded-2xl bg-card/20" />
          ))
        ) : (
          [
            { title: "Today Total Collection", value: "₹4,25,000", change: "+12%", trend: "up" },
            { title: "Today Cash", value: "₹2,10,000", change: "+8%", trend: "up" },
            { title: "Today UPI", value: "₹2,15,000", change: "+15%", trend: "up" },
            { title: "Today Expenses", value: "₹45,000", change: "-5%", trend: "down" },
            { title: "Today Bank Deposit", value: "₹1,50,000", change: "0%", trend: "up" },
            { title: "Current Cash in Hand", value: "₹65,000", change: "-2%", trend: "down" },
            { title: "Month Profit/Loss", value: "₹12,40,000", change: "+20%", trend: "up" },
            { title: "Partner Payable", value: "₹3,20,000", change: "+4%", trend: "up" },
          ].map((stat) => (
            <StatsCard 
              key={stat.title}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend as "up" | "down"}
            />
          ))
        )}
      </div>

      {/* Charts Section */}
      <div className="grid gap-8 grid-cols-1 xl:grid-cols-2">
        {isLoading ? (
          <>
            <Skeleton className="h-[400px] w-full rounded-[3rem] bg-card/20" />
            <Skeleton className="h-[400px] w-full rounded-[3rem] bg-card/20" />
            <Skeleton className="h-[400px] w-full rounded-[3rem] bg-card/20" />
            <Skeleton className="h-[400px] w-full rounded-[3rem] bg-card/20" />
          </>
        ) : (
          <>
            <ParkingCharts 
              data={parkingDashboardData.collectionTrend}
              type="collection"
              title="Daily Collection Trend"
              description="7-day trends for Cash vs digital remittance."
            />
            <ParkingCharts 
              data={parkingDashboardData.expenseTrend}
              type="expense"
              title="Expense Trend"
              description="Daily operational burn across all heads."
            />
            <ParkingCharts 
              data={parkingDashboardData.siteWiseCollection}
              type="collection"
              title="Site-Wise Collection"
              description="Total collection breakup across active sites."
            />
            <ParkingCharts 
              data={parkingDashboardData.monthWisePnL}
              type="collection"
              title="Monthwise Profit/Loss"
              description="Financial performance trajectory for the current FY."
            />
          </>
        )}
      </div>

      {/* Recent Activity Placeholder */}
      <div className="rounded-2xl border border-border/40 bg-card/20 backdrop-blur-sm p-8 min-h-[200px] flex flex-col items-center justify-center text-center">
         <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <RefreshCcw className="h-5 w-5 text-muted-foreground" />
         </div>
         <p className="text-sm font-medium text-muted-foreground italic">
            Waiting for real-time transaction stream...
         </p>
         <p className="text-xs text-muted-foreground/60 mt-1">
            Historical logs available in the Reports section.
         </p>
      </div>
    </div>
  )
}
