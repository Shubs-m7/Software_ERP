"use client"

import React, { useState, useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { calculateDailyClosing } from "@/lib/profit-loss-utils"
import { 
  Calculator, 
  ArrowRightLeft, 
  ArrowUpRight, 
  ArrowDownRight, 
  Banknote, 
  CreditCard,
  History,
  TrendingDown,
  Navigation,
  Download
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
import { cn } from "@/lib/utils"

export default function DailyCashSummaryPage() {
  const { transactions, vouchers, selectedProject } = useAppStore()
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0])

  const summary = useMemo(() => {
    const prevClosing = 125000 // Mock previous closing or fetch from store
    
    // 1. Cash Collection (Daily Collection) - Breakup UPI vs Cash
    const dailyCollections = (transactions || []).filter(t => t.type === "Collection" && t.date === searchDate)
    const cashColl = dailyCollections.filter(t => t.paymentMode === "Cash").reduce((acc, t) => acc + t.amount, 0)
    const upiColl = dailyCollections.filter(t => t.paymentMode === "UPI").reduce((acc, t) => acc + t.amount, 0)
    
    // 2. Expenses (Operational)
    const expenses = (transactions || [])
      .filter(t => t.type === "Expense" && t.date === searchDate)
      .reduce((acc, t) => acc + t.amount, 0)
    
    // 3. Advances (Partner Advances / Staff Advances)
    const advances = (vouchers || [])
      .filter(v => v.type === "PAYMENT" && v.date === searchDate && v.narration.toLowerCase().includes("advance"))
      .reduce((acc, v) => acc + v.totalAmount, 0)

    // 4. Banking (Bank Deposits)
    const banking = (vouchers || [])
      .filter(v => v.type === "CONTRA" && v.date === searchDate)
      .reduce((acc, v) => acc + v.totalAmount, 0)

    const closingBalance = calculateDailyClosing(prevClosing, cashColl + upiColl, expenses, advances, banking)

    return {
      prevClosing,
      cashColl,
      upiColl,
      totalColl: cashColl + upiColl,
      expenses,
      advances,
      banking,
      closingBalance
    }
  }, [transactions, vouchers, searchDate])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Calculator className="h-3 w-3" />
             Liquidity Audit Trail
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Daily <span className="text-primary italic">Cash Summary</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            Formula: Prev Closing + Coll - Exp - Adv - Bank
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="p-3 bg-muted/40 rounded-2xl border border-border/40 flex items-center gap-4">
              <Input 
                type="date" 
                className="h-9 bg-transparent border-none shadow-none font-bold text-sm w-40 p-0 focus-visible:ring-0"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
              />
           </div>
           <Button className="h-14 w-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:scale-110 transition-all">
              <Download className="h-6 w-6" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="rounded-[2.2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl">
             <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase text-muted-foreground mb-4">Previous Closing</p>
                <p className="text-2xl font-black font-mono">₹{summary.prevClosing.toLocaleString()}</p>
             </CardContent>
          </Card>
          <Card className="rounded-[2.2rem] border-border/40 bg-emerald-500/10 shadow-xl border-emerald-500/20">
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase text-emerald-600">Total Collection</p>
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black font-mono text-emerald-600">₹{summary.totalColl.toLocaleString()}</p>
                <div className="mt-2 flex gap-2">
                   <Badge variant="outline" className="text-[8px] border-emerald-500/20">CASH: ₹{summary.cashColl.toLocaleString()}</Badge>
                   <Badge variant="outline" className="text-[8px] border-emerald-500/20">UPI: ₹{summary.upiColl.toLocaleString()}</Badge>
                </div>
             </CardContent>
          </Card>
          <Card className="rounded-[2.2rem] border-border/40 bg-rose-500/10 shadow-xl border-rose-500/20">
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase text-rose-600">Total Outflow</p>
                  <ArrowDownRight className="h-4 w-4 text-rose-600" />
                </div>
                <p className="text-2xl font-black font-mono text-rose-600">₹{(summary.expenses + summary.advances + summary.banking).toLocaleString()}</p>
             </CardContent>
          </Card>
          <Card className={cn(
             "rounded-[2.2rem] border-border/40 shadow-xl border-primary/20",
             summary.closingBalance < 0 ? "bg-rose-600 text-white" : "bg-primary text-white"
          )}>
             <CardContent className="p-6">
                <p className="text-[10px] font-black uppercase opacity-60 mb-4">Final Closing Balance</p>
                <p className="text-2xl font-black font-mono">₹{summary.closingBalance.toLocaleString()}</p>
                {summary.closingBalance < 0 && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-bold">
                     <TrendingDown className="h-3 w-3" /> NEGATIVE BALANCE WARNING
                  </div>
                )}
             </CardContent>
          </Card>
      </div>

      <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl overflow-hidden">
         <CardHeader className="p-8 border-b border-border/20 bg-muted/20">
            <CardTitle className="text-xl font-bold italic">Liquidity Breakdown Matrix</CardTitle>
            <CardDescription>Detailed audit of cash movements for {searchDate}</CardDescription>
         </CardHeader>
         <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-muted/40">
                  <TableRow className="border-border/40 hover:bg-transparent">
                     <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest">Category</TableHead>
                     <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest text-right">Inflow (₹)</TableHead>
                     <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest text-right">Outflow (₹)</TableHead>
                     <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest text-right">Formula Action</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  <TableRow className="border-border/40">
                     <TableCell className="py-5 px-8 font-bold">Opening Liquidity</TableCell>
                     <TableCell className="py-5 px-4 text-right font-mono">₹{summary.prevClosing.toLocaleString()}</TableCell>
                     <TableCell className="py-5 px-4 text-right">--</TableCell>
                     <TableCell className="py-5 px-8 text-right italic text-xs text-muted-foreground">Start Base</TableCell>
                  </TableRow>
                  <TableRow className="border-border/40">
                     <TableCell className="py-5 px-8 font-bold">Operational Collections</TableCell>
                     <TableCell className="py-5 px-4 text-right font-mono text-emerald-600">+₹{summary.totalColl.toLocaleString()}</TableCell>
                     <TableCell className="py-5 px-4 text-right">--</TableCell>
                     <TableCell className="py-5 px-8 text-right italic text-xs text-muted-foreground">ADD</TableCell>
                  </TableRow>
                  <TableRow className="border-border/40">
                     <TableCell className="py-5 px-8 font-bold text-rose-600 italic">Operational Expenses</TableCell>
                     <TableCell className="py-5 px-4 text-right">--</TableCell>
                     <TableCell className="py-5 px-4 text-right font-mono text-rose-600">-₹{summary.expenses.toLocaleString()}</TableCell>
                     <TableCell className="py-5 px-8 text-right italic text-xs text-muted-foreground">SUBTRACT</TableCell>
                  </TableRow>
                  <TableRow className="border-border/40">
                     <TableCell className="py-5 px-8 font-bold text-rose-600 italic">Partner/Staff Advances</TableCell>
                     <TableCell className="py-5 px-4 text-right">--</TableCell>
                     <TableCell className="py-5 px-4 text-right font-mono text-rose-600">-₹{summary.advances.toLocaleString()}</TableCell>
                     <TableCell className="py-5 px-8 text-right italic text-xs text-muted-foreground">SUBTRACT</TableCell>
                  </TableRow>
                  <TableRow className="border-border/40">
                     <TableCell className="py-5 px-8 font-bold text-rose-600 italic">Bank Deposits (Contra)</TableCell>
                     <TableCell className="py-5 px-4 text-right">--</TableCell>
                     <TableCell className="py-5 px-4 text-right font-mono text-rose-600">-₹{summary.banking.toLocaleString()}</TableCell>
                     <TableCell className="py-5 px-8 text-right italic text-xs text-muted-foreground">SUBTRACT</TableCell>
                  </TableRow>
                  <TableRow className="bg-primary/5 hover:bg-primary/5 border-t-2 border-primary/20">
                     <TableCell className="py-8 px-8 font-black uppercase text-primary italic">Net Daily Closing</TableCell>
                     <TableCell colSpan={2} className="py-8 px-4 text-right font-black text-xl font-mono text-primary">₹{summary.closingBalance.toLocaleString()}</TableCell>
                     <TableCell className="py-8 px-8 text-right italic text-xs font-bold text-primary">RESULT</TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </CardContent>
      </Card>

    </div>
  )
}
