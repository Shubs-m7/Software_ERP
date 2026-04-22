"use client"

import React, { useState, useMemo } from "react"
import { 
  Building2, 
  IndianRupee, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Activity,
  CreditCard,
  Wallet,
  Landmark,
  ArrowRight,
  ArrowLeftRight,
  PieChart as PieIcon,
  ShieldCheck
} from "lucide-react"
import { ledgersData, ledgerGroupsData } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function LedgerSummaryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const ledgerStats = useMemo(() => {
    return ledgersData.map(ledger => {
      const group = ledgerGroupsData.find(g => g.id === ledger.groupId)
      const debit = 50000 + Math.random() * 200000
      const credit = 30000 + Math.random() * 150000
      const netFlow = debit - credit
      const closingBalance = ledger.openingBalance + (ledger.balanceType === "Dr" ? netFlow : -netFlow)
      
      return {
        ...ledger,
        groupName: group?.name || "Uncategorized",
        debit,
        credit,
        closingBalance: Math.abs(closingBalance),
        type: closingBalance >= 0 ? ledger.balanceType : (ledger.balanceType === "Dr" ? "Cr" : "Dr")
      }
    })
  }, [])

  const filteredLedgers = useMemo(() => {
    return ledgerStats.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      l.groupName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, ledgerStats])

  const totals = useMemo(() => {
    return filteredLedgers.reduce((acc, curr) => ({
      totalDebit: acc.totalDebit + curr.debit,
      totalCredit: acc.totalCredit + curr.credit,
    }), { totalDebit: 0, totalCredit: 0 })
  }, [filteredLedgers])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Landmark className="h-3 w-3" />
             Financial Accounting
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Ledger <span className="text-primary italic border-b-4 border-primary">Summary</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Consolidated account balances and transactional flow analysis.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Card className="px-6 py-3 rounded-2xl bg-card border border-border/40 shadow-xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">Net Position</p>
                 <p className="text-sm font-black text-foreground">Verified & Balanced</p>
              </div>
           </Card>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="rounded-[2.5rem] border-primary/20 bg-primary/5 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 h-32 w-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
            <CardContent className="p-8">
               <p className="text-[10px] font-black uppercase text-primary tracking-[0.2em] mb-2">Aggregate Debits</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter text-foreground">₹{(totals.totalDebit / 100000).toFixed(2)}L</span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-none font-bold text-[10px]">+12.4%</Badge>
               </div>
               <p className="text-xs font-bold text-muted-foreground mt-2 italic">Total account inflows for current period</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-border/40 bg-card shadow-2xl relative overflow-hidden group">
            <CardContent className="p-8">
               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-2">Aggregate Credits</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter text-foreground">₹{(totals.totalCredit / 100000).toFixed(2)}L</span>
                  <Badge className="bg-amber-500/10 text-amber-600 border-none font-bold text-[10px]">+8.1%</Badge>
               </div>
               <p className="text-xs font-bold text-muted-foreground mt-2 italic">Total account outflows for current period</p>
            </CardContent>
         </Card>

         <Card className="rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5 shadow-2xl relative overflow-hidden group">
            <CardContent className="p-8">
               <p className="text-[10px] font-black uppercase text-indigo-600 tracking-[0.2em] mb-2">Inflow Velocity</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black tracking-tighter text-indigo-600">1.42x</span>
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
               </div>
               <p className="text-xs font-bold text-muted-foreground mt-2 italic">Revenue accumulation vs Expense burn</p>
            </CardContent>
         </Card>
      </div>

      {/* Control Bar */}
      <Card className="rounded-[2rem] border-border/40 bg-white/40 backdrop-blur-md shadow-xl overflow-hidden">
        <CardContent className="p-6">
           <div className="relative">
              <Input 
                placeholder="Search ledgers, groups or natures..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-14 pl-14 bg-white/10 border-border/40 rounded-2xl font-bold text-lg placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
           </div>
        </CardContent>
      </Card>

      {/* Ledger Table Section */}
      <div className="rounded-[2.5rem] border border-border/40 bg-white/40 backdrop-blur-xl shadow-3xl overflow-hidden mb-12">
        <Table>
          <TableHeader className="bg-muted/50 h-20">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="px-8 font-black uppercase tracking-widest text-[10px]">Ledger Name & Classification</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[10px]">Opening Bal</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-emerald-600">Total Debit</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-red-600">Total Credit</TableHead>
              <TableHead className="px-8 text-right font-black uppercase tracking-widest text-[10px] text-primary">Closing Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLedgers.map((ledger) => (
              <TableRow key={ledger.id} className="border-border/40 hover:bg-primary/5 transition-colors h-20 group">
                <TableCell className="px-8">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-card border border-border/40 flex items-center justify-center text-primary shadow-inner">
                         <Landmark className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div>
                         <p className="text-sm font-black text-foreground">{ledger.name}</p>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60 tracking-wider">
                           {ledger.groupName}
                         </p>
                      </div>
                   </div>
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-muted-foreground italic">
                   ₹{ledger.openingBalance.toLocaleString()} <span className="text-[10px] opacity-60 ml-0.5">{ledger.balanceType}</span>
                </TableCell>
                <TableCell className="text-right font-mono font-black text-emerald-600/80">
                   ₹{ledger.debit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell className="text-right font-mono font-black text-red-600/80">
                   ₹{ledger.credit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
                <TableCell className="px-8 text-right">
                   <div className="flex flex-col items-end">
                      <p className="text-xl font-black font-mono text-primary tracking-tighter">
                        ₹{ledger.closingBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                      <Badge variant="secondary" className="rounded-full text-[8px] font-black px-2 mt-0.5 uppercase tracking-tighter">
                        Net {ledger.type} Balance
                      </Badge>
                   </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot className="bg-primary/5 border-t border-border/40">
             <TableRow className="h-20 hover:bg-transparent">
                <TableCell className="px-8 text-sm font-black uppercase tracking-widest text-primary flex items-center gap-3">
                   <ArrowLeftRight className="h-4 w-4" /> Consolidated Totals
                </TableCell>
                <TableCell className="text-right font-mono font-bold text-muted-foreground opacity-30 italic">N/A</TableCell>
                <TableCell className="text-right font-mono font-black text-xl text-emerald-700">₹{(totals.totalDebit / 100000).toFixed(2)}L</TableCell>
                <TableCell className="text-right font-mono font-black text-xl text-red-700">₹{(totals.totalCredit / 100000).toFixed(2)}L</TableCell>
                <TableCell className="px-8 text-right font-mono font-black text-2xl text-primary underline decoration-2 underline-offset-8">
                   ₹{Math.abs(totals.totalDebit - totals.totalCredit).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
             </TableRow>
          </tfoot>
        </Table>
      </div>

    </div>
  )
}
