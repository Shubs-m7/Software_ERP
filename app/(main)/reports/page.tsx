"use client"

import React from "react"
import { BarChart3, FileText, PieChart, TrendingUp, Calendar, ArrowRight, ShieldCheck, Filter } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ReportItem {
  name: string
  href: string
  desc: string
  disabled?: boolean
}

interface ReportCategory {
  title: string
  description: string
  icon: React.ReactNode
  reports: ReportItem[]
}

const reportCategories: ReportCategory[] = [
  {
    title: "Collection Intelligence",
    description: "Day-wise and vehicle-level analysis of revenue streams.",
    icon: <BarChart3 className="h-6 w-6 text-primary" />,
    reports: [
      { name: "Collection Summary", href: "/reports/collection-summary", desc: "Digital vs Cash aggregate logs" },
      { name: "Detailed Register", href: "/transactions/detailed-register", desc: "Logistics-grade vehicle logs (Ton/Rate)" },
      { name: "Parking/Plaza Log", href: "/reports/parking-log", desc: "Detailed ticket-level entry records" },
    ]
  },
  {
    title: "Financial Statements",
    description: "Fiscal performance and stakeholder share analysis.",
    icon: <PieChart className="h-6 w-6 text-amber-500" />,
    reports: [
      { name: "Cost-Centre wise P&L", href: "/reports/profit-loss", desc: "Departmental margin analysis" },
      { name: "Partner Share Statement", href: "/reports/partner-share", desc: "Equity distribution calculations" },
      { name: "Cash Performance", href: "/reports/cash-performance", desc: "Daily closing & formula bridge" },
      { name: "Ledger Statement", href: "/reports/ledger-summary", desc: "Consolidated head-wise balances" },
    ]
  },
  {
    title: "Audit & Deposits",
    description: "Tracking security holdings and historical adjustments.",
    icon: <FileText className="h-6 w-6 text-emerald-500" />,
    reports: [
      { name: "Security Deposit Register", href: "/masters/guarantees-deposits", desc: "BG & Security holding logs" },
      { name: "Old Expense Register", href: "/reports/old-expense", desc: "Historical cost adjustments" },
      { name: "Vehicle/Dispatch Log", href: "/reports/vehicle-log", desc: "Site-wise material movement audits" },
    ]
  }
]

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Hero Header */}
      <div className="relative p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 overflow-hidden shadow-2xl">
         <div className="absolute -right-20 -top-20 h-64 w-64 bg-primary/10 rounded-full blur-[100px]" />
         
         <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 self-start">
               <ShieldCheck className="h-4 w-4 text-primary" />
               <span className="text-xs font-black uppercase text-primary tracking-widest">Enterprise Reporting Matrix</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-foreground max-w-2xl leading-none">
              Powerful Insights for Your <span className="text-primary italic">Enterprise</span>.
            </h1>
         </div>
      </div>

      {/* Global Filter Matrix (Section 7.14) */}
      <Card className="rounded-[2.5rem] border-primary/10 bg-card/10 backdrop-blur-md overflow-hidden border-glass shadow-xl">
         <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8 px-1">
               <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Filter className="h-4 w-4" />
               </div>
               <h3 className="font-black text-xs uppercase tracking-[0.2em] text-foreground/80">Global Analysis Filter Matrix</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-6">
               {[
                 { label: "Company", placeholder: "All Companies" },
                 { label: "Project", placeholder: "All Projects" },
                 { label: "Cost Centre", placeholder: "All Centres" },
                 { label: "Fin Year", placeholder: "2024-25" },
                 { label: "Quarter", placeholder: "Select Q" },
                 { label: "Month", placeholder: "Select Month" },
                 { label: "Date Range", placeholder: "Select Range" },
               ].map((filter) => (
                 <div key={filter.label} className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-muted-foreground px-1 tracking-widest">{filter.label}</p>
                    <div className="h-12 px-4 rounded-xl bg-background/50 border border-border/40 flex items-center justify-between group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
                       <span className="text-[10px] font-bold text-muted-foreground/60">{filter.placeholder}</span>
                       <ArrowRight className="h-3 w-3 text-muted-foreground/30 rotate-90 group-hover:text-primary transition-colors" />
                    </div>
                 </div>
               ))}
            </div>
         </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {reportCategories.map((category) => (
          <div key={category.title} className="flex flex-col gap-6 p-2 rounded-[2.5rem] bg-card/20 border border-border/40 backdrop-blur-md transition-all hover:bg-card/30 hover:shadow-2xl group">
            <div className="p-6 space-y-2">
               <div className="h-14 w-14 rounded-2xl bg-card border border-border/40 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform">
                  {category.icon}
               </div>
               <h3 className="text-2xl font-black tracking-tight">{category.title}</h3>
               <p className="text-xs font-bold text-muted-foreground leading-relaxed">{category.description}</p>
            </div>
            
            <div className="flex flex-col gap-3 p-4 bg-muted/40 rounded-[2rem] border border-border/20">
               {category.reports.map((report) => (
                 <Link 
                   key={report.name} 
                   href={report.disabled ? "#" : report.href}
                   className={cn(
                     "flex items-center justify-between p-5 rounded-2xl bg-card/50 border border-transparent hover:border-primary/30 hover:shadow-lg transition-all group/item",
                     report.disabled && "opacity-40 cursor-not-allowed grayscale"
                   )}
                 >
                    <div>
                      <p className="text-sm font-black text-foreground group-hover/item:text-primary transition-colors">{report.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">{report.desc}</p>
                    </div>
                    {!report.disabled && <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover/item:translate-x-1 group-hover/item:text-primary transition-all" />}
                 </Link>
               ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
