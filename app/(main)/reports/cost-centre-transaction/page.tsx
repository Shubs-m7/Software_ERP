"use client"

import React, { useState, useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  BarChart4, 
  MapPin, 
  Search, 
  Download, 
  Calendar, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Printer,
  Building2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { projectsData, ledgersData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function CostCentreTransactionReportPage() {
  const { vouchers, transactions, businessType } = useAppStore()
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("2024-04-01")
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])

  // Aggregate all transactions by cost centre (Project)
  const costCentreLogs = useMemo(() => {
    const list: any[] = []

    // 1. Get Vouchers for the project
    vouchers.forEach(v => {
      if (selectedProjectId === "all" || v.projectId === selectedProjectId) {
        v.lines.forEach(l => {
          list.push({
            date: v.date,
            type: v.type,
            voucherNo: v.voucherNo,
            ledgerName: ledgersData.find(ld => ld.id === l.ledgerId)?.name || l.ledgerId,
            projectId: v.projectId,
            narration: l.narration || v.narration,
            amount: l.drAmount || l.crAmount,
            flow: l.drAmount > 0 ? "EXPENSE" : "INCOME",
            refId: v.id
          })
        })
      }
    })

    // 2. Get Operational Transactions
    transactions.forEach(t => {
       if (selectedProjectId === "all" || t.project === selectedProjectId) {
          list.push({
             date: t.date,
             type: t.type === "Collection" ? "COLLECTION" : "EXPENSE",
             voucherNo: t.id,
             ledgerName: t.type === "Collection" ? "Direct Revenue" : "Direct Expense",
             projectId: t.project,
             narration: `Daily operational entry - ${t.businessType}`,
             amount: t.amount,
             flow: t.type === "Collection" ? "INCOME" : "EXPENSE",
             refId: t.id
          })
       }
    })

    return list
      .filter(e => e.date >= dateFrom && e.date <= dateTo)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [vouchers, transactions, selectedProjectId, dateFrom, dateTo])

  const totals = useMemo(() => {
    return costCentreLogs.reduce((acc, e) => ({
      income: acc.income + (e.flow === "INCOME" ? e.amount : 0),
      expense: acc.expense + (e.flow === "EXPENSE" ? e.amount : 0)
    }), { income: 0, expense: 0 })
  }, [costCentreLogs])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-28 px-2">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
               <MapPin className="h-3 w-3" />
               Operational Intelligence
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
              Cost Centre <span className="text-amber-500 italic">Analysis</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Site / Unit</label>
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                   <SelectTrigger className="w-[280px] h-12 rounded-xl bg-card border-border/40 font-bold">
                      <SelectValue placeholder="All Cost Centres" />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Enterprise Sites</SelectItem>
                      {projectsData.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                   </SelectContent>
                </Select>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Reporting Window</label>
                <div className="flex items-center gap-2 bg-card border border-border/40 rounded-xl px-4 h-12">
                   <Calendar className="h-4 w-4 text-muted-foreground" />
                   <Input 
                      type="date" 
                      className="border-none bg-transparent shadow-none w-32 p-0 text-xs font-bold" 
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                   />
                   <span className="text-xs font-black text-muted-foreground opacity-30 mx-1">/</span>
                   <Input 
                      type="date" 
                      className="border-none bg-transparent shadow-none w-32 p-0 text-xs font-bold" 
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                   />
                </div>
             </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <Button className="h-12 rounded-xl bg-primary font-black gap-2 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Download className="h-4 w-4" /> Export Report
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <Card className="rounded-[2rem] border-border/40 bg-card/10 backdrop-blur-md">
             <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Total Site Revenue</p>
                <div className="flex items-end gap-3">
                   <p className="text-3xl font-black font-mono tracking-tighter text-emerald-600">₹{totals.income.toLocaleString()}</p>
                   <ArrowUpRight className="h-5 w-5 text-emerald-500 mb-2" />
                </div>
             </CardContent>
          </Card>
          <Card className="rounded-[2rem] border-border/40 bg-card/10 backdrop-blur-md">
             <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Total Site Expense</p>
                <div className="flex items-end gap-3">
                   <p className="text-3xl font-black font-mono tracking-tighter text-rose-600">₹{totals.expense.toLocaleString()}</p>
                   <ArrowDownRight className="h-5 w-5 text-rose-500 mb-2" />
                </div>
             </CardContent>
          </Card>
          <Card className={cn(
             "rounded-[2rem] border-border/40 xl:col-span-2",
             totals.income - totals.expense >= 0 ? "bg-emerald-500/10 border-emerald-500/20" : "bg-rose-500/10 border-rose-500/20"
          )}>
             <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-muted-foreground">Centre Operating Profit</p>
                   <p className={cn(
                      "text-4xl font-black font-mono italic tracking-tighter",
                      totals.income - totals.expense >= 0 ? "text-emerald-600" : "text-rose-600"
                   )}>
                      {totals.income - totals.expense >= 0 ? "+" : "-"}₹{Math.abs(totals.income - totals.expense).toLocaleString()}
                   </p>
                </div>
                <div className="h-16 w-16 rounded-[1.5rem] bg-white/50 backdrop-blur flex items-center justify-center shadow-xl">
                   <PieChart className={cn(
                      "h-8 w-8",
                      totals.income - totals.expense >= 0 ? "text-emerald-600" : "text-rose-600"
                   )} />
                </div>
             </CardContent>
          </Card>
      </div>

      <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl overflow-hidden">
         <CardHeader className="p-8 border-b border-border/20 flex flex-row items-center justify-between">
            <div>
               <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <BarChart4 className="h-6 w-6 text-amber-500" />
                  Transaction Log Matrix
               </CardTitle>
               <CardDescription>Consolidated movements across selected cost centres.</CardDescription>
            </div>
            <Badge variant="outline" className="rounded-full px-4 h-9 font-black uppercase text-[10px] border-amber-500/20 text-amber-600 bg-amber-500/5">
               {selectedProjectId === "all" ? "Enterprise Wide" : projectsData.find(p => p.id === selectedProjectId)?.name}
            </Badge>
         </CardHeader>
         <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent">
                     <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest">Entry Date</TableHead>
                     <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest whitespace-nowrap">Site / Unit</TableHead>
                     <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Ledger Mapping</TableHead>
                     <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Narration</TableHead>
                     <TableHead className="py-6 px-8 text-right font-black text-foreground uppercase text-[10px] tracking-widest whitespace-nowrap">Net Amount (₹)</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {costCentreLogs.length > 0 ? (
                    costCentreLogs.map((entry, idx) => (
                      <TableRow key={idx} className="border-border/40 hover:bg-muted/10 transition-colors group">
                         <TableCell className="py-6 px-8 font-bold text-xs">{entry.date}</TableCell>
                         <TableCell className="py-6 px-4">
                            <div className="flex items-center gap-2">
                               <Building2 className="h-3 w-3 text-muted-foreground" />
                               <span className="text-[11px] font-black uppercase tracking-tight">{projectsData.find(p => p.id === entry.projectId)?.name || entry.projectId}</span>
                            </div>
                         </TableCell>
                         <TableCell className="py-6 px-4">
                            <div className="flex flex-col gap-1">
                               <span className="text-xs font-black italic text-foreground">{entry.ledgerName}</span>
                               <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{entry.type}</span>
                            </div>
                         </TableCell>
                         <TableCell className="py-6 px-4">
                            <p className="text-[11px] font-medium text-muted-foreground italic line-clamp-1">{entry.narration || "Operational flow"}</p>
                         </TableCell>
                         <TableCell className="py-6 px-8 text-right">
                            <span className={cn(
                               "font-black font-mono text-base italic",
                               entry.flow === "INCOME" ? "text-emerald-600" : "text-rose-500"
                            )}>
                               {entry.flow === "INCOME" ? "+" : "-"}₹{entry.amount.toLocaleString()}
                            </span>
                         </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                       <TableCell colSpan={5} className="h-64 text-center">
                          <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                             <MapPin className="h-10 w-10 mb-2" />
                             <p className="text-sm font-black uppercase tracking-widest text-primary">No Activity Detected</p>
                             <p className="text-xs font-medium italic">Record transactions to see site-wise distribution.</p>
                          </div>
                       </TableCell>
                    </TableRow>
                  )}
               </TableBody>
            </Table>
         </CardContent>
      </Card>
    </div>
  )
}
