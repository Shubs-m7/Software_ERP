"use client"

import React, { useState, useMemo } from "react"
import { VoucherForm } from "@/components/transactions/voucher-form"
import { Voucher, VoucherFormValues } from "@/types/voucher"
import { projectsData, ledgersData } from "@/lib/mock-data"
import { useAppStore } from "@/store/use-app-store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Building2, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

export default function JournalEntryPage() {
  const { addVoucher } = useAppStore()
  const [sessionJournals, setSessionJournals] = useState<Voucher[]>([])

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
    setSessionJournals(prev => [newVoucher, ...prev])
    alert("Journal Voucher posted successfully!")
  }

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id
  const getLedgerName = (id: string) => ledgersData.find(l => l.id === id)?.name || id

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Journal Entry
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-500" />
            General adjustments, rectification entries, and non-cash transactions.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-right">
              <p className="text-[10px] font-black uppercase text-purple-700 tracking-widest">Journal Entries</p>
              <p className="text-2xl font-black font-mono text-purple-600">{sessionJournals.length} Posted</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Section */}
        <Card className="xl:col-span-12 rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8 px-2">
               <BookOpen className="h-6 w-6 text-primary" />
               <h2 className="text-xl font-bold">New Journal Voucher</h2>
            </div>
            <VoucherForm type="JOURNAL" onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="xl:col-span-12 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <History className="h-5 w-5 text-muted-foreground" />
                 <h2 className="text-lg font-bold">Recent Journals</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessionJournals.length > 0 ? (
                sessionJournals.map((voucher) => (
                  <Card key={voucher.id} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden border-l-4 border-l-purple-500">
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest leading-none mb-1">
                                {voucher.voucherNo}
                             </p>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span>{getProjectName(voucher.projectId)}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black font-mono text-foreground">₹{voucher.totalAmount.toLocaleString()}</p>
                             <p className="text-[10px] text-muted-foreground font-bold">{voucher.date}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-3 mb-4">
                          {voucher.lines.map((l, idx) => (
                             <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                                <span className={cn(l.drAmount > 0 ? "text-purple-600" : "text-muted-foreground")}>
                                   {l.drAmount > 0 ? "To (Dr):" : "By (Cr):"} {getLedgerName(l.ledgerId)}
                                </span>
                                <span className="text-foreground">₹{(l.drAmount || l.crAmount).toLocaleString()}</span>
                             </div>
                          ))}
                       </div>

                       <div className="h-px w-full bg-border/20 mb-4" />

                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-tighter text-purple-600">Adjustment Entry</span>
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
                      <BookOpen className="h-8 w-8" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Records Found</p>
                      <p className="text-xs font-medium">Post a journal adjustment to see it in history.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
