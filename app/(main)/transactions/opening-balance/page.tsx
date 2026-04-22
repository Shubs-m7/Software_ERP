"use client"

import React, { useState } from "react"
import { Landmark, ArrowRightCircle, History, Building2, Receipt, Download, Database } from "lucide-react"
import { Voucher, VoucherFormValues } from "@/types/voucher"
import { useAppStore } from "@/store/use-app-store"
import { VoucherForm } from "@/components/transactions/voucher-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projectsData, ledgersData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function OpeningBalanceEntryPage() {
  const { addVoucher } = useAppStore()
  const [sessionBalances, setSessionBalances] = useState<Voucher[]>([])

  const handleFormSubmit = (data: VoucherFormValues) => {
    const totalAmount = data.lines.reduce((acc, l) => acc + (l.drAmount || l.crAmount), 0) / 2
    
    const newVoucher: Voucher = {
      ...data,
      id: `ob-${Math.random().toString(36).substr(2, 9)}`,
      totalAmount,
      status: "PENDING",
      requestedBy: "Current User",
      requestedAt: new Date().toLocaleString()
    }
    
    addVoucher(newVoucher)
    setSessionBalances(prev => [newVoucher, ...prev])
    alert("Opening balance initialized successfully!")
  }

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id
  const getLedgerName = (id: string) => ledgersData.find(l => l.id === id)?.name || id

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-500/10 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Database className="h-3 w-3" />
             Fiscal Onboarding
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Opening <span className="text-slate-500 italic">Balance Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <ArrowRightCircle className="h-4 w-4 text-slate-500" />
            Initialize ledger balances for the current financial year.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-slate-500/5 border border-slate-500/20 text-right">
              <p className="text-[10px] font-black uppercase text-slate-700 tracking-widest">Initialised Today</p>
              <p className="text-2xl font-black font-mono text-slate-600">
                {sessionBalances.length} Ledgers
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Column */}
        <Card className="xl:col-span-12 rounded-[2.5rem] border-slate-500/10 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8 px-2">
               <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-slate-500" />
                  <h2 className="text-xl font-bold">New Balance Entry</h2>
               </div>
               <Badge variant="outline" className="rounded-full border-slate-500/20 text-slate-600 font-black uppercase text-[10px] px-4 py-1.5 bg-slate-500/5">
                  Initialisation Mode
               </Badge>
            </div>
            <VoucherForm type="JOURNAL" onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <div className="xl:col-span-12 space-y-6">
           {sessionBalances.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {sessionBalances.map((voucher) => (
                   <Card key={voucher.id} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden border-l-4 border-l-slate-500">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-1">
                                 {voucher.voucherNo}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                 <Building2 className="h-3 w-3" />
                                 <span>{getProjectName(voucher.projectId)}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-black font-mono text-slate-600">₹{voucher.totalAmount.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground font-bold">{voucher.date}</p>
                           </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                           {voucher.lines.map((l, idx) => (
                              <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                                 <span className={cn(l.drAmount > 0 ? "text-slate-600" : "text-muted-foreground")}>
                                    {l.drAmount > 0 ? "Dr:" : "Cr:"} {getLedgerName(l.ledgerId)}
                                 </span>
                                 <span className="text-foreground">₹{(l.drAmount || l.crAmount).toLocaleString()}</span>
                              </div>
                           ))}
                        </div>
                     </CardContent>
                   </Card>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  )
}
