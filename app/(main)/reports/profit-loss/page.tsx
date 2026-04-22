"use client"

import React, { useState, useMemo } from "react"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  PieChart as PieIcon, 
  Calendar,
  Building2,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Landmark,
  FileDown,
  Download
} from "lucide-react"
import { projectsData, ledgersData, ledgerGroupsData, dailyTransactionsData, vouchers } from "@/lib/mock-data"
import { aggregateSectionalPL, SectionalPLStatement } from "@/lib/profit-loss-utils"
import { useAppStore } from "@/store/use-app-store"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function ProfitLossPage() {
  const { transactions, vouchers, selectedProject, settings } = useAppStore()
  const [projectFilter, setProjectFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"standard" | "cost-centre">("standard")

  const currentProject = useMemo(() => {
    if (projectFilter === "all") return null
    return projectsData.find(p => p.id === projectFilter) || null
  }, [projectFilter])

  const projectType = currentProject?.type === "BALU" ? "Balu" : "Toll"

  const data: SectionalPLStatement[] = useMemo(() => {
    return aggregateSectionalPL(transactions, vouchers, projectFilter, ledgersData, ledgerGroupsData, projectType)
  }, [transactions, vouchers, projectFilter, projectType])

  const totals = useMemo(() => {
    return data.reduce((acc, curr) => ({
      income: acc.income + curr.totalIncome,
      expenses: acc.expenses + curr.totalExpense,
      profit: acc.profit + curr.netProfit,
      partnerShare: acc.partnerShare + curr.partnerShare,
    }), { income: 0, expenses: 0, profit: 0, partnerShare: 0 })
  }, [data])

  const totalRevenue = totals.income
  const overallMargin = totalRevenue > 0 ? (totals.profit / totalRevenue) * 100 : 0

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <BarChart3 className="h-3 w-3" />
             Enterprise P&L Summary
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Cash Basis <span className="text-primary italic">P&L Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Rule-compliant reporting grouped by Direct & Indirect heads for FY {settings.currentFinancialYear}.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <Button variant="outline" className="h-12 rounded-2xl border-border/40 font-bold gap-2 px-6">
              <Download className="h-4 w-4" /> Export Summary
           </Button>
           <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 text-right min-w-[120px]">
              <p className="text-[10px] font-black uppercase text-primary tracking-widest leading-none mb-1">Net Margin</p>
              <p className={cn("text-2xl font-black font-mono tracking-tighter", overallMargin >= 0 ? "text-emerald-500" : "text-rose-500")}>
                {overallMargin.toFixed(1)}%
              </p>
           </div>
        </div>
      </div>

      {totals.profit < 0 && (
         <Alert className="rounded-[2.5rem] border-rose-500/20 bg-rose-500/5 text-rose-600 p-8 shadow-2xl">
            <TrendingDown className="h-5 w-5" />
            <AlertTitle className="font-black uppercase tracking-widest text-[10px] mb-2 leading-none">Negative Cash Balance Warning</AlertTitle>
            <AlertDescription className="text-xs font-medium italic opacity-80 leading-relaxed max-w-2xl">
               System has detected a negative cash position for the selected period. This occurs when operational expenses and partner draws exceed net receivables. Please verify collection recording.
            </AlertDescription>
         </Alert>
      )}

      {/* Control Bar */}
      <Card className="rounded-[2.5rem] border-primary/10 bg-gradient-to-br from-primary/5 via-card to-background backdrop-blur-3xl shadow-3xl overflow-hidden">
        <CardContent className="p-8 flex flex-col md:flex-row items-end gap-6">
            <div className="space-y-2 flex-1 w-full">
              <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1 text-primary">
                <Building2 className="h-3 w-3" /> Analysis Site/Project
              </label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger className="h-14 bg-white/30 border-border/40 rounded-2xl font-bold shadow-inner">
                  <SelectValue placeholder="Consolidated View" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl">
                  <SelectItem value="all" className="font-bold italic">Consolidated Enterprise View</SelectItem>
                  {projectsData.map(p => (
                    <SelectItem key={p.id} value={p.id} className="font-bold italic uppercase text-[10px]">{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
               <Button className="h-14 px-10 rounded-2xl bg-foreground text-background font-black shadow-2xl shadow-foreground/20 hover:scale-[1.02] transition-all">
                 <Filter className="h-5 w-5 mr-3" /> REFRESH ANALYSIS
               </Button>
            </div>
        </CardContent>
      </Card>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
         {[
           { label: "Total Net Revenue", value: totals.income, icon: <ArrowUpRight className="h-6 w-6" />, color: "emerald", sub: "Aggregated Receipts" },
           { label: "Operating Expense", value: totals.expenses, icon: <ArrowDownRight className="h-6 w-6" />, color: "rose", sub: "Operational Burn" },
           { label: "Net Cash Profit", value: totals.profit, icon: <TrendingUp className="h-6 w-6" />, color: "primary", sub: "Liquidity Delta" },
           { label: "Partner Share Payout", value: totals.partnerShare, icon: <PieIcon className="h-6 w-6" />, color: "amber", sub: "Stakeholder Draw" },
         ].map((kpi) => (
           <Card key={kpi.label} className="rounded-[2.5rem] border-border/40 bg-card/10 backdrop-blur-md relative overflow-hidden group hover:scale-[1.02] transition-all cursor-default">
              <div className={cn("absolute top-0 right-0 h-1 w-full opacity-50", kpi.color === "emerald" ? "bg-emerald-500" : kpi.color === "rose" ? "bg-rose-500" : kpi.color === "primary" ? "bg-primary" : "bg-amber-500")} />
              <CardContent className="p-8">
                 <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner", 
                    kpi.color === "emerald" ? "bg-emerald-500/10 text-emerald-500" : 
                    kpi.color === "rose" ? "bg-rose-500/10 text-rose-500" : 
                    kpi.color === "primary" ? "bg-primary/10 text-primary" : 
                    "bg-amber-500/10 text-amber-500"
                 )}>
                    {kpi.icon}
                 </div>
                 <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-2">{kpi.label}</p>
                 <p className={cn("text-3xl font-black tracking-tighter font-mono italic", 
                    kpi.color === "emerald" ? "text-emerald-600" : 
                    kpi.color === "rose" ? "text-rose-600" : 
                    kpi.color === "primary" ? "text-primary-600" : 
                    "text-amber-600"
                 )}>
                    ₹{kpi.value.toLocaleString()}
                 </p>
                 <p className="text-[10px] font-bold text-muted-foreground mt-2 opacity-60 uppercase">{kpi.sub}</p>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* Sectional P&L Matrix */}
      <Card className="rounded-[3rem] border border-border/40 bg-card/10 backdrop-blur-md overflow-hidden mb-12 shadow-3xl">
          <div className="p-10 border-b border-border/20 bg-muted/20 flex flex-col md:flex-row items-center justify-between gap-6">
             <div>
                <h3 className="text-2xl font-black tracking-tighter italic flex items-center gap-3">
                  <Landmark className="h-6 w-6 text-primary" />
                  {projectType} Operational Matrix
                </h3>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">
                  Sectional {viewMode === "cost-centre" ? "Pivot" : "Consolidated"} View • Identity Sovereignty Enforced
                </p>
             </div>
             <div className="flex gap-2 p-1 bg-background/50 rounded-xl border border-border/40">
                <Button 
                  onClick={() => setViewMode("standard")} 
                  variant={viewMode === "standard" ? "default" : "ghost"}
                  className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest px-4"
                >
                  Standard View
                </Button>
                <Button 
                  onClick={() => setViewMode("cost-centre")} 
                  variant={viewMode === "cost-centre" ? "default" : "ghost"}
                  className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest px-4"
                >
                  Stakeholder Pivot
                </Button>
             </div>
          </div>
          <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/20 h-20">
                     <TableHead className="px-10 font-black uppercase tracking-widest text-[9px] w-64 text-foreground">Operational Clusters</TableHead>
                     {data.map(month => (
                       <TableHead key={month.month} className="text-right font-black uppercase tracking-widest text-[9px] min-w-[120px] px-8 italic">
                         {month.month} '24
                       </TableHead>
                     ))}
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data[0]?.sections.map((section, idx) => (
                    <TableRow key={section.title} className="border-border/10 hover:bg-primary/5 transition-colors h-16 group">
                       <TableCell className="px-10 font-black text-[11px] text-foreground uppercase tracking-tight italic">
                          {section.title}
                       </TableCell>
                       {data.map(month => (
                          <TableCell key={`${month.month}-${idx}`} className={cn(
                            "text-right font-mono font-bold px-8",
                            section.isNegative ? "text-rose-500/80" : "text-emerald-600/80"
                          )}>
                            ₹{month.sections[idx]?.amount.toLocaleString()}
                          </TableCell>
                       ))}
                    </TableRow>
                  ))}

                  {/* Operational Delta Row */}
                  <TableRow className="border-t-2 border-border/20 bg-muted/20 h-20">
                     <TableCell className="px-10 font-black text-[10px] uppercase text-primary italic underline decoration-2 decoration-primary/20 underline-offset-4">Net Monthly Delta</TableCell>
                     {data.map(month => (
                       <TableCell key={`${month.month}-result`} className="text-right font-mono font-black text-xl text-primary px-8">
                         ₹{month.netProfit.toLocaleString()}
                       </TableCell>
                     ))}
                  </TableRow>
               </TableBody>
               <tfoot className="bg-primary/5 border-t-4 border-primary/20">
                  <TableRow className="h-32 hover:bg-transparent">
                     <TableCell className="px-10 text-sm font-black uppercase tracking-widest text-primary italic leading-tight">Net Year-to-Date<br />Performance Audit</TableCell>
                     <TableCell colSpan={data.length} className="text-right px-10">
                        <div className="inline-flex gap-8 items-center bg-background/50 p-6 rounded-[2rem] border border-primary/10 shadow-inner">
                           <div className="flex flex-col text-right">
                              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Cumulative Net Profit</span>
                              <span className="text-4xl font-black text-primary italic tracking-tighter leading-none">₹{totals.profit.toLocaleString()}</span>
                           </div>
                           <div className="h-16 w-px bg-primary/20" />
                           <div className="flex flex-col text-right">
                              <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Stakeholder Drawdown</span>
                              <span className="text-3xl font-black text-amber-600 italic tracking-tighter leading-none">₹{totals.partnerShare.toLocaleString()}</span>
                           </div>
                        </div>
                     </TableCell>
                  </TableRow>
               </tfoot>
            </Table>
          </CardContent>
      </Card>
    </div>
  )
}
