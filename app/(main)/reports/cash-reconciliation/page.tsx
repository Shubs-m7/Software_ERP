"use client"

import React, { useState, useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  Calculator, 
  History, 
  Search, 
  Download, 
  ArrowRightLeft, 
  CheckCircle2, 
  AlertCircle,
  Banknote,
  Navigation
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

export default function CashReconciliationPage() {
  const { vouchers, transactions, selectedProject } = useAppStore()
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0])
  const [physicalCash, setPhysicalCash] = useState<string>("")

  // Calculate System Balance for cash up to selected date
  const reconciliationData = useMemo(() => {
    // 1. Get Opening balance (mock for now or from store if implemented)
    const openingBalance = 50000 
    
    // 2. Aggregate Receipts (Cash In)
    const cashIn = vouchers
      .filter(v => v.type === "RECEIPT" && v.date <= searchDate)
      .reduce((acc, v) => acc + v.totalAmount, 0)
      
    // 3. Aggregate Payments (Cash Out)
    const cashOut = vouchers
      .filter(v => v.type === "PAYMENT" && v.date <= searchDate)
      .reduce((acc, v) => acc + v.totalAmount, 0)

    // 4. Aggregate Daily Collections (Operational Cash In)
    const operationalIn = (transactions || [])
      .filter(t => t.type === "Collection" && t.date <= searchDate)
      .reduce((acc, t) => acc + t.amount, 0)

    const systemBalance = (openingBalance + cashIn + operationalIn) - cashOut
    const physicalVal = parseFloat(physicalCash) || 0
    const difference = physicalVal - systemBalance

    return {
      openingBalance,
      cashIn: cashIn + operationalIn,
      cashOut,
      systemBalance,
      physicalVal,
      difference
    }
  }, [vouchers, transactions, searchDate, physicalCash])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Calculator className="h-3 w-3" />
             Auditing & Reconciliation
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Cash <span className="text-primary italic">Reconciliation</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Navigation className="h-4 w-4 text-primary" />
            Vary system balances against physical counts for account integrity.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="p-3 bg-muted/40 rounded-2xl border border-border/40 flex items-center gap-4">
              <div className="space-y-0.5">
                 <p className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Select Reconcile Date</p>
                 <Input 
                   type="date" 
                   className="h-9 bg-transparent border-none shadow-none font-bold text-sm w-40 p-0 focus-visible:ring-0"
                   value={searchDate}
                   onChange={(e) => setSearchDate(e.target.value)}
                 />
              </div>
              <Search className="h-5 w-5 text-muted-foreground/50" />
           </div>
           <Button className="h-14 w-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:scale-110 transition-all">
              <Download className="h-6 w-6" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Summary Matrix */}
         <div className="xl:col-span-8 flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="rounded-[2.2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl">
                   <CardContent className="p-6">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-4 flex items-center gap-2">
                         <History className="h-3 w-3" /> System Cash Balance
                      </p>
                      <p className="text-3xl font-black font-mono tracking-tighter">₹{reconciliationData.systemBalance.toLocaleString()}</p>
                      <div className="mt-4 h-1 w-full bg-border/20 rounded-full overflow-hidden">
                         <div className="h-full bg-primary/40 w-full" />
                      </div>
                   </CardContent>
                </Card>

                <Card className={cn(
                   "rounded-[2.2rem] border-border/40 shadow-xl transition-all",
                   reconciliationData.difference === 0 ? "bg-emerald-500/10 border-emerald-500/20" :
                   reconciliationData.difference > 0 ? "bg-blue-500/10 border-blue-500/20" :
                   "bg-rose-500/10 border-rose-500/20"
                )}>
                   <CardContent className="p-6">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-4 flex items-center gap-2">
                         <ArrowRightLeft className="h-3 w-3" /> Reconcile Difference
                      </p>
                      <p className={cn(
                        "text-3xl font-black font-mono tracking-tighter",
                        reconciliationData.difference === 0 ? "text-emerald-500" :
                        reconciliationData.difference > 0 ? "text-blue-500" : "text-rose-500"
                      )}>
                        {reconciliationData.difference >= 0 ? "+" : "-"}₹{Math.abs(reconciliationData.difference).toLocaleString()}
                      </p>
                      <div className="mt-4 flex items-center gap-2">
                         {reconciliationData.difference === 0 ? (
                           <Badge className="bg-emerald-500 text-white border-none text-[8px] font-black uppercase">Balanced</Badge>
                         ) : (
                           <Badge variant="outline" className="border-rose-500/30 text-rose-500 text-[8px] font-black uppercase">Variance Found</Badge>
                         )}
                      </div>
                   </CardContent>
                </Card>

                <Card className="rounded-[2.2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl border-dashed">
                   <CardContent className="p-6">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-4 flex items-center gap-2">
                         <Banknote className="h-3 w-3" /> Physical Cash Entry
                      </p>
                      <div className="relative">
                         <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-black opacity-30 italic">₹</span>
                         <Input 
                           className="text-3xl font-black font-mono tracking-tighter p-0 pl-6 h-10 bg-transparent border-none focus-visible:ring-0 placeholder:opacity-10 shadow-none hover:bg-transparent"
                           placeholder="0,000"
                           value={physicalCash}
                           onChange={(e) => setPhysicalCash(e.target.value)}
                         />
                      </div>
                      <p className="text-[10px] font-bold text-muted-foreground mt-4 italic">Update physical count to reconcile</p>
                   </CardContent>
                </Card>
            </div>

            <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-xl overflow-hidden">
               <CardHeader className="p-8 border-b border-border/20">
                  <div className="flex items-center justify-between">
                     <div>
                        <CardTitle className="text-xl font-bold italic">Transaction Flow Analysis</CardTitle>
                        <CardDescription>Breakdown of cash movements contributing to the system balance.</CardDescription>
                     </div>
                     <Badge variant="outline" className="rounded-full px-4 h-8 font-bold border-primary/20 text-primary">
                        {searchDate}
                     </Badge>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/40 hover:bg-transparent">
                           <TableHead className="py-6 px-8 font-bold text-foreground">Account Ledger</TableHead>
                           <TableHead className="py-6 px-4 font-bold text-foreground">Type</TableHead>
                           <TableHead className="py-6 px-4 font-bold text-foreground">Source</TableHead>
                           <TableHead className="py-6 px-8 text-right font-bold text-foreground uppercase tracking-widest text-[10px]">Flow Amount</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        <TableRow className="border-border/40 hover:bg-muted/10 transition-colors">
                           <TableCell className="py-5 px-8 font-bold text-muted-foreground">Opening Ledger Balance</TableCell>
                           <TableCell className="py-5 px-4"><Badge variant="outline">INITIAL</Badge></TableCell>
                           <TableCell className="py-5 px-4 italic text-xs text-muted-foreground">Setup Master</TableCell>
                           <TableCell className="py-5 px-8 text-right font-bold text-foreground font-mono">₹{reconciliationData.openingBalance.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="border-border/40 hover:bg-muted/10 transition-colors">
                           <TableCell className="py-5 px-8 font-bold">Total Cash Receipts</TableCell>
                           <TableCell className="py-5 px-4"><Badge className="bg-emerald-500/10 text-emerald-600 border-none">INFLOW</Badge></TableCell>
                           <TableCell className="py-5 px-4 italic text-xs text-muted-foreground">Receipt / Collection</TableCell>
                           <TableCell className="py-5 px-8 text-right font-bold text-emerald-600 font-mono">₹{reconciliationData.cashIn.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="border-border/40 hover:bg-muted/10 transition-colors">
                           <TableCell className="py-5 px-8 font-bold">Total Cash Payments</TableCell>
                           <TableCell className="py-5 px-4"><Badge className="bg-rose-500/10 text-rose-600 border-none">OUTFLOW</Badge></TableCell>
                           <TableCell className="py-5 px-4 italic text-xs text-muted-foreground">Payment Entry</TableCell>
                           <TableCell className="py-5 px-8 text-right font-bold text-rose-600 font-mono">₹{reconciliationData.cashOut.toLocaleString()}</TableCell>
                        </TableRow>
                        <TableRow className="border-t-2 border-border/40 bg-primary/5">
                           <TableCell colSpan={3} className="py-6 px-8 text-sm font-black uppercase text-primary italic">Resultant System Balance</TableCell>
                           <TableCell className="py-6 px-8 text-right font-black text-primary text-xl font-mono">₹{reconciliationData.systemBalance.toLocaleString()}</TableCell>
                        </TableRow>
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </div>

         {/* Sidbar Audit Controls */}
         <div className="xl:col-span-4 space-y-8">
            <Card className="rounded-[2.5rem] border-border/40 bg-card/10 backdrop-blur-md shadow-xl overflow-hidden glass-card">
               <CardHeader className="p-8 border-b border-border/20">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                        <CheckCircle2 className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-bold italic">Audit Post</CardTitle>
                        <CardDescription>Lock reconciliation for today.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-6">
                  {reconciliationData.difference !== 0 ? (
                    <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 space-y-3">
                       <div className="flex items-center gap-2 text-rose-600">
                          <AlertCircle className="h-5 w-5" />
                          <span className="text-sm font-black uppercase italic">Variance Detected</span>
                       </div>
                       <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                         System and Physical balances do not match. Please investigate missing vouchers or recording errors before posting the audit.
                       </p>
                    </div>
                  ) : (
                    <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                       <div className="flex items-center gap-2 text-emerald-600 text-sm font-black uppercase italic">
                          <CheckCircle2 className="h-5 w-5" />
                          Books Balanced
                       </div>
                       <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                         Balance verified. You can now post this reconciliation for archival accountability.
                       </p>
                    </div>
                  )}

                  <Button 
                    className="w-full h-16 rounded-3xl font-black text-lg bg-primary hover:scale-[1.02] transition-all disabled:opacity-30 disabled:grayscale" 
                    disabled={reconciliationData.difference !== 0 || !physicalCash}
                  >
                     POST RECONCILIATION
                  </Button>
               </CardContent>
            </Card>

            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border border-border/40 relative overflow-hidden flex flex-col gap-4">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                  <Calculator className="h-[200px] w-[200px] -mr-20 -mt-20" />
               </div>
               <p className="text-xs font-bold text-primary uppercase tracking-widest">Auditor's Note</p>
               <p className="text-sm font-medium italic text-muted-foreground italic">
                 "Accuracy in cash reconciliation is the pulse of operational integrity. Ensure every voucher is posted before physical verification."
               </p>
            </div>
         </div>

      </div>
    </div>
  )
}
