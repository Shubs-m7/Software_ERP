"use client"

import React, { useState } from "react"
import { Archive, History as HistoryIcon, Building2, Receipt, Download, AlertCircle } from "lucide-react"
import { Voucher, VoucherFormValues } from "@/types/voucher"
import { useAppStore } from "@/store/use-app-store"
import { VoucherForm } from "@/components/transactions/voucher-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projectsData, ledgersData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function OldExpenseEntryPage() {
  const { addVoucher } = useAppStore()
  const [sessionOldExpenses, setSessionOldExpenses] = useState<Voucher[]>([])

  const handleFormSubmit = (data: VoucherFormValues) => {
    const totalAmount = data.lines.reduce((acc, l) => acc + l.drAmount, 0)
    
    const newVoucher: Voucher = {
      ...data,
      id: `old-${Math.random().toString(36).substr(2, 9)}`,
      totalAmount,
      status: "PENDING",
      requestedBy: "Current User",
      requestedAt: new Date().toLocaleString()
    }
    
    addVoucher(newVoucher)
    setSessionOldExpenses(prev => [newVoucher, ...prev])
    alert("Historical expense recorded successfully!")
  }

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id
  const getLedgerName = (id: string) => ledgersData.find(l => l.id === id)?.name || id

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Archive className="h-3 w-3" />
             Historical Data Migration
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Old Expense <span className="text-rose-500 italic">Archive Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500" />
            Record expenditures from previous periods for P&L continuity.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 text-right shadow-inner">
              <p className="text-[10px] font-black uppercase text-rose-700 tracking-widest">Migrated Sum</p>
              <p className="text-2xl font-black font-mono text-rose-600">
                ₹{sessionOldExpenses.reduce((acc, s) => acc + s.totalAmount, 0).toLocaleString()}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Column */}
        <Card className="xl:col-span-12 rounded-[2.5rem] border-rose-500/10 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8 px-2">
               <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-rose-500" />
                  <h2 className="text-xl font-bold">Historical Cost Registry</h2>
               </div>
               <Badge variant="outline" className="rounded-full border-rose-500/20 text-rose-600 font-black uppercase text-[10px] px-4 py-1.5 bg-rose-500/5">
                  Archival Mode Active
               </Badge>
            </div>
            <VoucherForm type="PAYMENT" onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <div className="xl:col-span-12 space-y-6">
           {sessionOldExpenses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                 {sessionOldExpenses.map((voucher) => (
                   <Card key={voucher.id} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden border-l-4 border-l-rose-500">
                     <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                           <div className="space-y-1">
                              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1">
                                 {voucher.voucherNo}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                 <Building2 className="h-3 w-3" />
                                 <span>{getProjectName(voucher.projectId)}</span>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-xl font-black font-mono text-rose-600">₹{voucher.totalAmount.toLocaleString()}</p>
                              <p className="text-[10px] text-muted-foreground font-bold italic">{voucher.date}</p>
                           </div>
                        </div>
                        <div className="h-px w-full bg-border/20 mb-4" />
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-black uppercase text-muted-foreground">Status: Migrated</span>
                           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-rose-500/10 hover:text-rose-600">
                              <HistoryIcon className="h-3 w-3" />
                           </Button>
                        </div>
                     </CardContent>
                   </Card>
                 ))}
              </div>
           ) : (
                <div className="col-span-full p-20 rounded-[3rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground opacity-30">
                   <div className="h-16 w-16 rounded-[2rem] bg-muted/20 flex items-center justify-center">
                      <Archive className="h-8 w-8" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Historical Records</p>
                      <p className="text-xs font-medium italic">Migrate an old expense to see it in history.</p>
                   </div>
                </div>
           )}
        </div>
      </div>
    </div>
  )
}
