"use client"

import React, { useState, useMemo } from "react"
import { VoucherForm } from "@/components/transactions/voucher-form"
import { Voucher, VoucherFormValues } from "@/types/voucher"
import { projectsData, ledgersData } from "@/lib/mock-data"
import { useAppStore } from "@/store/use-app-store"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Receipt, History, Landmark, Building2, TrendingUp, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ReceiptEntryPage() {
  const { addVoucher, vouchers } = useAppStore()
  const [sessionReceipts, setSessionReceipts] = useState<Voucher[]>([])

  const handleFormSubmit = (data: VoucherFormValues) => {
    const totalAmount = data.lines.reduce((acc, l) => acc + l.drAmount, 0)
    
    const newVoucher: Voucher = {
      ...data,
      id: `v-${Math.random().toString(36).substr(2, 9)}`,
      totalAmount,
      status: "PENDING",
      requestedBy: "Current User",
      requestedAt: new Date().toLocaleString()
    }
    
    addVoucher(newVoucher)
    setSessionReceipts(prev => [newVoucher, ...prev])
    alert("Receipt Voucher posted successfully!")
  }

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id
  const getLedgerName = (id: string) => ledgersData.find(l => l.id === id)?.name || id

  const totalSessionReceipt = useMemo(() => 
    sessionReceipts.reduce((acc, curr) => acc + curr.totalAmount, 0)
  , [sessionReceipts])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Receipt Entry
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            Record money received from customers, partners, or other sources.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-right">
              <p className="text-[10px] font-black uppercase text-emerald-700 tracking-widest">Receipts This Session</p>
              <p className="text-2xl font-black font-mono text-emerald-600">₹{totalSessionReceipt.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Section */}
        <Card className="xl:col-span-12 rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8 px-2">
               <Receipt className="h-6 w-6 text-primary" />
               <h2 className="text-xl font-bold">New Receipt Voucher</h2>
            </div>
            <VoucherForm type="RECEIPT" onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="xl:col-span-12 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <History className="h-5 w-5 text-muted-foreground" />
                 <h2 className="text-lg font-bold">Recent Receipts</h2>
              </div>
              <Badge variant="outline" className="rounded-full bg-primary/5 text-primary border-primary/20">
                 {sessionReceipts.length} Entries Posted
              </Badge>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessionReceipts.length > 0 ? (
                sessionReceipts.map((voucher) => (
                  <Card key={voucher.id} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">
                                {voucher.voucherNo}
                             </p>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span>{getProjectName(voucher.projectId)}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black font-mono text-emerald-500">₹{voucher.totalAmount.toLocaleString()}</p>
                             <p className="text-[10px] text-muted-foreground font-bold">{voucher.date}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-2 mb-4">
                          {voucher.lines.filter(l => l.crAmount > 0).map((l, idx) => (
                             <div key={idx} className="flex justify-between items-center text-[11px] font-bold">
                                <span className="text-muted-foreground">From: {getLedgerName(l.ledgerId)}</span>
                                <span className="text-foreground">₹{l.crAmount.toLocaleString()}</span>
                             </div>
                          ))}
                       </div>

                       <Separator className="bg-border/20 mb-4" />

                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-tighter text-amber-600">Pending Review</span>
                          </div>
                          {voucher.narration && (
                             <p className="text-[10px] text-muted-foreground italic truncate max-w-[120px]">
                               {voucher.narration}
                             </p>
                          )}
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-20 rounded-[3rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground opacity-30">
                   <div className="h-16 w-16 rounded-[2rem] bg-muted/20 flex items-center justify-center">
                      <Receipt className="h-8 w-8" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Records Found</p>
                      <p className="text-xs font-medium">Post a new receipt to see it in history.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />
}
