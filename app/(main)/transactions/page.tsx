"use client"

import React, { useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  Truck, 
  ArrowUpRight, 
  Plus, 
  History,
  LayoutGrid,
  ChevronRight,
  Calculator
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusIndicator } from "@/components/transactions/status-indicator"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function TransactionsDashboard() {
  const { transactions } = useAppStore()

  const stats = useMemo(() => {
    const collections = transactions
      .filter(t => t.type === "Collection")
      .reduce((acc, t) => acc + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === "Expense")
      .reduce((acc, t) => acc + t.amount, 0)

    const dispatches = transactions
      .filter(t => t.type === "Dispatch")
      .reduce((acc, t) => acc + t.amount, 0)
    
    return { collections, expenses, dispatches }
  }, [transactions])

  const quickLinks = [
    { title: "Daily Register", desc: "Unified financial log", url: "/transactions/daily-entries", icon: Calculator, color: "primary" },
    { title: "Expense Entry", desc: "Record operational costs", url: "/transactions/expense-entry", icon: TrendingDown, color: "rose" },
    { title: "Parking Entry", desc: "Issue slips & collect", url: "/transactions/parking-entry", icon: Plus, color: "blue" },
    { title: "Batch Dispatch", desc: "Bulk vehicle logging", url: "/transactions/balu-dispatch", icon: Truck, color: "amber" },
  ]

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/50">
            Transactions Dashboard
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <LayoutGrid className="h-4 w-4 text-primary" />
            Centralized hub for financial and operational records.
          </p>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Collections", value: stats.collections, icon: TrendingUp, color: "blue" },
          { label: "Total Expenses", value: stats.expenses, icon: TrendingDown, color: "rose" },
          { label: "Total Dispatches", value: stats.dispatches, icon: Truck, color: "amber" },
        ].map((item) => (
          <Card key={item.label} className="group overflow-hidden rounded-[2rem] border-border/40 bg-card/10 backdrop-blur-md transition-all hover:bg-card/20">
            <CardContent className="p-8 relative">
              <div className={cn(
                "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity",
                `bg-${item.color}-500`
              )} />
              
              <div className="flex justify-between items-start mb-6">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110",
                    item.color === "blue" ? "bg-blue-600 text-white shadow-blue-500/20" :
                    item.color === "rose" ? "bg-rose-500 text-white shadow-rose-500/20" :
                    "bg-amber-500 text-white shadow-amber-500/20"
                 )}>
                    <item.icon className="h-6 w-6" />
                 </div>
                 <ArrowUpRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
              </div>

              <div>
                <p className="text-xs font-black uppercase text-muted-foreground tracking-widest mb-1">{item.label}</p>
                <p className="text-3xl font-black font-mono">₹{item.value.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Quick Links Grid */}
        <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
           {quickLinks.map((link) => (
             <Link href={link.url} key={link.title}>
                <Card className="h-full rounded-[2rem] border-border/40 bg-card/10 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95 group border-glass">
                  <CardContent className="p-6 flex items-center gap-4">
                     <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                        link.color === "primary" ? "bg-primary/10 text-primary" :
                        `bg-${link.color}-500/10 text-${link.color}-500`
                     )}>
                        <link.icon className="h-6 w-6" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">{link.title}</h3>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{link.desc}</p>
                     </div>
                     <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
             </Link>
           ))}
        </div>

        {/* Live Activity Feed */}
        <div className="xl:col-span-12 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <History className="h-5 w-5 text-primary" />
                 <h2 className="text-xl font-bold tracking-tight">Recent Session Activity</h2>
              </div>
              <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5" asChild>
                <Link href="/transactions/daily-entries">View All Logs</Link>
              </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              {transactions.slice(0, 5).map((tx) => (
                <Card key={tx.id} className="rounded-3xl border-border/40 bg-card/5 backdrop-blur-md hover:bg-card/10 transition-all group overflow-hidden">
                   <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4 min-w-[300px]">
                         <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                            tx.type === "Collection" ? "bg-emerald-500/10 text-emerald-500" :
                            tx.type === "Expense" ? "bg-rose-500/10 text-rose-500" :
                            "bg-blue-500/10 text-blue-500"
                         )}>
                            {tx.type === "Collection" ? <TrendingUp className="h-5 w-5" /> : 
                             tx.type === "Expense" ? <TrendingDown className="h-5 w-5" /> : 
                             <Truck className="h-5 w-5" />}
                         </div>
                         <div className="space-y-0.5">
                            <p className="font-black text-sm uppercase tracking-tight">{tx.project}</p>
                            <p className="text-[10px] text-muted-foreground font-bold">{tx.details}</p>
                         </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                         <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{tx.time}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                               {tx.status === "Success" && !tx.isEdited && <StatusIndicator status="Locked" className="scale-[0.85]" />}
                               {tx.status === "Pending" && <StatusIndicator status="Pending" className="scale-[0.85]" />}
                               {tx.isEdited && <StatusIndicator status="Edited" className="scale-[0.85]" />}
                            </div>
                         </div>
                         <div className="w-[120px] text-right">
                            <p className={cn(
                               "text-xl font-black font-mono",
                               tx.type === "Expense" ? "text-rose-500" : "text-emerald-500"
                            )}>
                               {tx.type === "Expense" ? "-" : "+"}₹{tx.amount.toLocaleString()}
                            </p>
                         </div>
                      </div>
                   </CardContent>
                </Card>
              ))}
           </div>
        </div>
      </div>

      {/* Aesthetic Footer */}
      <div className="p-8 rounded-[2.5rem] border border-dashed border-border/40 bg-card/5 backdrop-blur-md flex flex-col items-center justify-center text-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
         <CreditCard className="h-8 w-8 text-muted-foreground" />
         <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">End-to-End Encryption Enabled</p>
            <p className="text-[9px] text-muted-foreground/60 font-medium">All financial events are logged with persistent audit trails and SHA-256 integrity checks.</p>
         </div>
      </div>
    </div>
  )
}
