"use client"

import React, { useState, useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  BookOpen, 
  Search, 
  Download, 
  Calendar, 
  Filter, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Printer,
  FileSpreadsheet
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
import { ledgersData, projectsData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function LedgerDetailedRegisterPage() {
  const { vouchers, transactions } = useAppStore()
  const [selectedLedgerId, setSelectedLedgerId] = useState<string>("")
  const [dateFrom, setDateFrom] = useState("2024-04-01")
  const [dateTo, setDateTo] = useState(new Date().toISOString().split('T')[0])

  // Aggregate all transactions for the selected ledger
  const ledgerEntries = useMemo(() => {
    if (!selectedLedgerId) return []

    const entries: any[] = []

    // 1. Crawl Vouchers
    vouchers.forEach(v => {
      v.lines.forEach(l => {
        if (l.ledgerId === selectedLedgerId) {
          entries.push({
            date: v.date,
            type: v.type,
            voucherNo: v.voucherNo,
            projectId: v.projectId,
            narration: (l as any).narration || (l as any).remark || v.narration,
            drAmount: l.drAmount,
            crAmount: l.crAmount,
            refId: v.id
          })
        }
      })
    })

    // 2. Crawl Operational Transactions
    transactions.forEach(t => {
      // Logic for operational transactions mapping to ledgers (e.g. Sales A/c, Expense A/c)
      // This is a simplified mapping for demonstration
      if (t.type === "Collection" && selectedLedgerId === "led-sales") {
         entries.push({
            date: t.date,
            type: "COLLECTION",
            voucherNo: t.id,
            projectId: t.project,
            narration: "Daily Operational Collection",
            drAmount: 0,
            crAmount: t.amount,
            refId: t.id
         })
      }
      if (t.type === "Expense" && selectedLedgerId === "led-expense") {
         entries.push({
            date: t.date,
            type: "EXPENSE",
            voucherNo: t.id,
            projectId: t.project,
            narration: "Daily Operational Expense",
            drAmount: t.amount,
            crAmount: 0,
            refId: t.id
         })
      }
    })

    // Sort by date
    return entries
      .filter(e => e.date >= dateFrom && e.date <= dateTo)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [vouchers, transactions, selectedLedgerId, dateFrom, dateTo])

  // Calculate Running Balances
  const processedEntries = useMemo(() => {
    let currentBalance = 0
    return ledgerEntries.map(e => {
      currentBalance += (e.drAmount - e.crAmount)
      return { ...e, balance: currentBalance }
    })
  }, [ledgerEntries])

  const totals = useMemo(() => {
    return processedEntries.reduce((acc, e) => ({
      dr: acc.dr + e.drAmount,
      cr: acc.cr + e.crAmount
    }), { dr: 0, cr: 0 })
  }, [processedEntries])

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-28 px-2">
      
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
               <BookOpen className="h-3 w-3" />
               Enterprise Audit Trail
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
              Ledger <span className="text-primary italic">Detailed Register</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Select Ledger Account</label>
                <Select value={selectedLedgerId} onValueChange={setSelectedLedgerId}>
                   <SelectTrigger className="w-[300px] h-12 rounded-xl bg-card border-border/40 font-bold">
                      <SelectValue placeholder="Choose a ledger..." />
                   </SelectTrigger>
                   <SelectContent className="rounded-xl">
                      {ledgersData.map(l => (
                        <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                      ))}
                      <SelectItem value="led-sales">Sales Revenue A/c</SelectItem>
                      <SelectItem value="led-expense">General Expense A/c</SelectItem>
                   </SelectContent>
                </Select>
             </div>

             <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date Range</label>
                <div className="flex items-center gap-2 bg-card border border-border/40 rounded-xl px-4 h-12">
                   <Calendar className="h-4 w-4 text-muted-foreground" />
                   <Input 
                      type="date" 
                      className="border-none bg-transparent shadow-none w-32 p-0 text-xs font-bold" 
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                   />
                   <span className="text-xs font-black text-muted-foreground">TO</span>
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
           <Button variant="outline" className="h-12 rounded-xl font-bold gap-2">
              <Printer className="h-4 w-4" /> Print
           </Button>
           <Button className="h-12 rounded-xl bg-emerald-600 font-bold gap-2 shadow-xl shadow-emerald-500/20">
              <FileSpreadsheet className="h-4 w-4" /> Export Excel
           </Button>
        </div>
      </div>

      {selectedLedgerId ? (
        <Card className="rounded-[2.5rem] border-border/40 bg-card/10 backdrop-blur-3xl shadow-2xl overflow-hidden mb-10">
           <CardHeader className="p-8 border-b border-border/20 bg-muted/20">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                       <Search className="h-6 w-6" />
                    </div>
                    <div>
                       <CardTitle className="text-2xl font-black italic tracking-tight">
                         {ledgersData.find(l => l.id === selectedLedgerId)?.name || (selectedLedgerId === "led-sales" ? "Sales Revenue A/c" : "General Expense A/c")}
                       </CardTitle>
                       <CardDescription className="text-xs font-medium">Detailed transaction trail for the selected period.</CardDescription>
                    </div>
                 </div>
                 <div className="flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Period Net Change</p>
                       <p className={cn(
                          "text-2xl font-black font-mono",
                          totals.dr - totals.cr >= 0 ? "text-emerald-500" : "text-rose-500"
                       )}>
                          ₹{(totals.dr - totals.cr).toLocaleString()}
                       </p>
                    </div>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-0">
              <Table>
                 <TableHeader className="bg-muted/40">
                    <TableRow className="border-border/40 hover:bg-transparent">
                       <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest">Date / Type</TableHead>
                       <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Voucher # / Ref</TableHead>
                       <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Site / Project</TableHead>
                       <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Particulars / Narration</TableHead>
                       <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest text-right">Debit (₹)</TableHead>
                       <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest text-right">Credit (₹)</TableHead>
                       <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest text-right">Balance (₹)</TableHead>
                    </TableRow>
                 </TableHeader>
                 <TableBody>
                    {processedEntries.length > 0 ? (
                      processedEntries.map((entry, idx) => (
                        <TableRow key={idx} className="border-border/40 hover:bg-muted/20 transition-all group">
                           <TableCell className="py-6 px-8 whitespace-nowrap">
                              <div className="flex flex-col gap-1">
                                 <span className="font-bold text-foreground text-xs">{entry.date}</span>
                                 <Badge variant="outline" className="w-fit text-[8px] font-black h-4 px-1 leading-none border-primary/20 text-primary">{entry.type}</Badge>
                              </div>
                           </TableCell>
                           <TableCell className="py-6 px-4">
                              <span className="text-[11px] font-black font-mono text-muted-foreground group-hover:text-primary transition-colors">{entry.voucherNo}</span>
                           </TableCell>
                           <TableCell className="py-6 px-4 whitespace-nowrap">
                              <span className="text-xs font-bold text-foreground italic underline decoration-primary/20 underline-offset-4">{getProjectName(entry.projectId)}</span>
                           </TableCell>
                           <TableCell className="py-6 px-4 min-w-[200px]">
                              <p className="text-xs font-medium text-muted-foreground italic leading-relaxed line-clamp-2">{entry.narration || "No Narration provided"}</p>
                           </TableCell>
                           <TableCell className="py-6 px-4 text-right">
                              <span className={cn("font-black font-mono", entry.drAmount > 0 ? "text-rose-500" : "text-muted-foreground/20")}>
                                 {entry.drAmount > 0 ? entry.drAmount.toLocaleString() : "--"}
                              </span>
                           </TableCell>
                           <TableCell className="py-6 px-4 text-right">
                              <span className={cn("font-black font-mono", entry.crAmount > 0 ? "text-emerald-500" : "text-muted-foreground/20")}>
                                 {entry.crAmount > 0 ? entry.crAmount.toLocaleString() : "--"}
                              </span>
                           </TableCell>
                           <TableCell className="py-6 px-8 text-right bg-muted/10">
                              <div className="flex items-center justify-end gap-2">
                                 <span className={cn(
                                    "font-black font-mono text-sm",
                                    entry.balance >= 0 ? "text-foreground" : "text-rose-600"
                                 )}>
                                    ₹{Math.abs(entry.balance).toLocaleString()}
                                 </span>
                                 <span className="text-[9px] font-black uppercase text-muted-foreground">{entry.balance >= 0 ? "Dr" : "Cr"}</span>
                              </div>
                           </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                         <TableCell colSpan={7} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                               <BookOpen className="h-10 w-10 mb-2" />
                               <p className="text-sm font-black uppercase tracking-widest text-primary">No Transactions Mapped</p>
                               <p className="text-xs font-medium italic">Select a ledger or expand date range to see trail.</p>
                            </div>
                         </TableCell>
                      </TableRow>
                    )}
                 </TableBody>
                 {processedEntries.length > 0 && (
                    <tfoot className="bg-muted/30 border-t-2 border-border/40">
                       <TableRow>
                          <TableCell colSpan={4} className="py-8 px-8 font-black uppercase text-primary italic tracking-tighter text-lg">Total Portfolio Movements</TableCell>
                          <TableCell className="py-8 px-4 text-right">
                             <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total DR</span>
                                <span className="font-black font-mono text-rose-600 text-lg">₹{totals.dr.toLocaleString()}</span>
                             </div>
                          </TableCell>
                          <TableCell className="py-8 px-4 text-right">
                             <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total CR</span>
                                <span className="font-black font-mono text-emerald-600 text-lg">₹{totals.cr.toLocaleString()}</span>
                             </div>
                          </TableCell>
                          <TableCell className="py-8 px-8 text-right bg-primary/5">
                             <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1">Closing Ledger</span>
                                <span className="font-black font-mono text-primary text-xl">₹{Math.abs(processedEntries[processedEntries.length - 1].balance).toLocaleString()}</span>
                             </div>
                          </TableCell>
                       </TableRow>
                    </tfoot>
                 )}
              </Table>
           </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center justify-center p-32 rounded-[3.5rem] border-2 border-dashed border-border/20 text-center gap-6 opacity-40">
           <div className="h-24 w-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-2xl">
              <BookOpen className="h-10 w-10" />
           </div>
           <div className="space-y-2">
              <p className="text-2xl font-black italic tracking-tight">Voucher Trail Interface</p>
              <p className="text-sm font-medium italic">Please select a ledger account from the dropdown above to generate the detailed register.</p>
           </div>
        </div>
      )}
    </div>
  )
}
