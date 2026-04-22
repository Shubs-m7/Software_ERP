"use client"

import React, { useState, useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  Users, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  HandCoins, 
  Download, 
  Filter,
  BarChart3,
  Calendar,
  Layers
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
import { projectsData, ledgersData, ledgerGroupsData, partnersData, vouchers, dailyTransactionsData } from "@/lib/mock-data"
import { aggregateSectionalPL } from "@/lib/profit-loss-utils"
import { cn } from "@/lib/utils"

export default function PartnerShareReportPage() {
  const { vouchers, transactions, settings } = useAppStore()
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>("all")
  
  const currentPartner = useMemo(() => {
    return partnersData.find(p => p.id === selectedPartnerId) || null
  }, [selectedPartnerId])

  // Aggregate monthly data for the selected partner
  const monthlyData = useMemo(() => {
    const plData = aggregateSectionalPL(dailyTransactionsData, vouchers, "all", ledgersData, ledgerGroupsData, "Toll")
    
    return plData.map(month => {
      const shareRatio = currentPartner?.shareRatio || 33.33
      const profitShare = (month.netProfit * shareRatio) / 100
      
      // Calculate advances specifically for this partner via reportCategory mapping
      const advanceTaken = vouchers
        .filter(v => v.date.includes(month.month) && v.lines.some(l => l.ledgerId === selectedPartnerId))
        .reduce((acc, v) => acc + v.totalAmount, 0)

      return {
        month: month.month,
        profitShare,
        advanceTaken,
        netPayable: profitShare - advanceTaken,
        shareRatio
      }
    })
  }, [selectedPartnerId, transactions, vouchers, currentPartner])

  const totals = useMemo(() => {
    return monthlyData.reduce((acc, curr) => ({
      profit: acc.profit + curr.profitShare,
      advances: acc.advances + curr.advanceTaken,
      net: acc.net + curr.netPayable
    }), { profit: 0, advances: 0, net: 0 })
  }, [monthlyData])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-28">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <PieChartIcon className="h-3 w-3" />
             Stakeholder Intelligence
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Partner <span className="text-purple-500 italic">Share Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Layers className="h-4 w-4 text-purple-500" />
            Track profit distribution, equity ratios, and capital draws.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="px-5 py-3 h-14 bg-muted/30 border border-border/40 rounded-2xl flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-black uppercase italic">FY {settings.currentFinancialYear}</span>
           </div>
           <Button className="h-14 w-14 rounded-2xl bg-purple-600 shadow-xl shadow-purple-600/20 hover:scale-110 transition-all font-black">
              <Download className="h-6 w-6" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         
         {/* KPI Row */}
         <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="rounded-[2.2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl border-l-4 border-l-emerald-500">
               <CardContent className="p-6">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Total Net Profit</p>
                  <p className="text-3xl font-black font-mono tracking-tighter text-emerald-600">₹{totals.profit.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 flex items-center gap-1 italic">
                     <TrendingUp className="h-3 w-3" /> +12% from last quarter
                  </p>
               </CardContent>
            </Card>

            <Card className="rounded-[2.2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl border-l-4 border-l-purple-500">
               <CardContent className="p-6">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Advances Disbursed</p>
                  <p className="text-3xl font-black font-mono tracking-tighter text-purple-600 italic">
                    ₹{totals.advances.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 italic underline decoration-purple-500/30 underline-offset-4">YTD Distribution Trace</p>
               </CardContent>
            </Card>

            <Card className="rounded-[2.2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl border-l-4 border-l-primary">
               <CardContent className="p-6">
                  <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Net Equity Position</p>
                  <p className="text-3xl font-black font-mono tracking-tighter text-primary italic">
                    ₹{totals.net.toLocaleString()}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-2 italic">Retained at Enterprise level</p>
               </CardContent>
            </Card>
            
            <Card className="rounded-[2.2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl opacity-60">
                <CardContent className="p-6 flex flex-col justify-center h-full">
                   <div className="flex items-center gap-4">
                      <Progress value={92} className="h-2 w-full bg-border/20" />
                      <span className="text-[10px] font-black text-primary italic leading-none whitespace-nowrap">92% DIST.</span>
                   </div>
                   <p className="text-[9px] font-medium text-muted-foreground mt-2">Allocation accuracy verified</p>
                </CardContent>
            </Card>
         </div>

      {/* Control Bar */}
      <Card className="rounded-[2.5rem] border-purple-500/10 bg-card/20 backdrop-blur-xl shadow-2xl mb-12">
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-purple-600 tracking-widest flex items-center gap-2 px-1">
                <Users className="h-3 w-3" /> Select Partner
              </label>
              <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                 <SelectTrigger className="h-12 bg-muted/10 border-border/40 font-bold rounded-2xl">
                    <SelectValue placeholder="Choose Stakeholder" />
                 </SelectTrigger>
                 <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl">
                    <SelectItem value="all" className="h-12 font-bold uppercase italic">All Partners</SelectItem>
                    {partnersData.map((p) => (<SelectItem key={p.id} value={p.id} className="h-12 font-bold uppercase italic">{p.name}</SelectItem>))}
                 </SelectContent>
              </Select>
           </div>
           <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20">
              <p className="text-[9px] font-black uppercase text-purple-600 tracking-widest">Target Share Ratio</p>
              <p className="text-xl font-black italic">{currentPartner?.shareRatio || 33.33}% Equity</p>
           </div>
        </CardContent>
      </Card>

      {/* Month-wise Performance Matrix (8.6) */}
      <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl overflow-hidden mb-12">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 h-20 hover:bg-transparent">
              <TableHead className="px-10 font-black uppercase tracking-widest text-[9px]">FY Period</TableHead>
              <TableHead className="text-center font-black uppercase tracking-widest text-[9px]">Share Ratio %</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-emerald-600">Profit Share</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-rose-500">Advance Taken</TableHead>
              <TableHead className="px-10 text-right font-black uppercase tracking-widest text-[9px] text-purple-600 underline decoration-2">Net Payable</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {monthlyData.map((row) => (
              <TableRow key={row.month} className="border-border/40 hover:bg-purple-500/5 transition-all h-16 group">
                <TableCell className="px-10 font-black text-sm text-foreground italic group-hover:text-purple-600 transition-colors uppercase">
                  {row.month} 2024
                </TableCell>
                <TableCell className="text-center font-mono font-black text-primary/60">{row.shareRatio}%</TableCell>
                <TableCell className="text-right font-mono font-bold text-emerald-600">₹{row.profitShare.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono font-bold text-rose-500">₹{row.advanceTaken.toLocaleString()}</TableCell>
                <TableCell className="px-10 text-right">
                   <Badge className={cn(
                     "font-black font-mono px-4 py-1.5 rounded-lg border-none shadow-sm",
                     row.netPayable >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-500"
                   )}>
                      ₹{row.netPayable.toLocaleString()}
                   </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot className="bg-purple-500/5 border-t-2 border-purple-500/20 h-24">
             <TableRow className="hover:bg-transparent">
                <TableCell className="px-10 font-black text-xs uppercase tracking-widest text-purple-700 italic leading-tight">YTD Equity<br/>Consolidation</TableCell>
                <TableCell className="text-center opacity-30 font-black italic">FY {settings.currentFinancialYear}</TableCell>
                <TableCell className="text-right font-mono font-black text-lg text-emerald-700">₹{totals.profit.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono font-black text-lg text-rose-600">₹{totals.advances.toLocaleString()}</TableCell>
                <TableCell className="px-10 text-right">
                   <div className="inline-block p-4 px-6 rounded-2xl bg-purple-600 text-white font-black text-xl shadow-xl shadow-purple-600/30 italic tracking-tighter">
                      ₹{totals.net.toLocaleString()}
                   </div>
                </TableCell>
             </TableRow>
          </tfoot>
        </Table>
      </Card>

         <div className="xl:col-span-12 p-10 rounded-[3rem] bg-muted/10 border border-border/40 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 rounded-[2rem] bg-purple-600 flex items-center justify-center text-white shadow-2xl shadow-purple-600/30 animate-pulse">
                  <HandCoins className="h-8 w-8" />
               </div>
               <div className="space-y-1">
                  <p className="text-xl font-black italic tracking-tighter">Automatic Settlement Simulation</p>
                  <p className="text-sm font-medium text-muted-foreground">System recommends distributing profits at end of quarter based on current net positions.</p>
               </div>
            </div>
            <Button className="rounded-2xl h-14 px-10 bg-white text-black font-black hover:bg-white/90 shadow-xl border border-border/40 uppercase tracking-widest text-[10px]">
               Generate Payout Log
            </Button>
         </div>

      </div>
    </div>
  )
}
