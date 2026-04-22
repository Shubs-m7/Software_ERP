"use client"

import React, { useState } from "react"
import { ShoppingBag, History, Building2, Receipt, TrendingDown, Download } from "lucide-react"
import { Voucher, VoucherFormValues } from "@/types/voucher"
import { useAppStore } from "@/store/use-app-store"
import { VoucherForm } from "@/components/transactions/voucher-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projectsData, ledgersData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function PurchaseEntryPage() {
  const { addVoucher } = useAppStore()
  const [sessionPurchases, setSessionPurchases] = useState<Voucher[]>([])

  const handleFormSubmit = (data: VoucherFormValues) => {
    // For Purchase, total amount is normally the Debit side (Expenditure)
    const totalAmount = data.lines.reduce((acc, l) => acc + l.drAmount, 0)
    
    const newVoucher: Voucher = {
      ...data,
      id: `purc-${Math.random().toString(36).substr(2, 9)}`,
      totalAmount,
      status: "PENDING",
      requestedBy: "Current User",
      requestedAt: new Date().toLocaleString()
    }
    
    addVoucher(newVoucher)
    setSessionPurchases(prev => [newVoucher, ...prev])
    alert("Purchase Invoice posted successfully!")
  }

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id
  const getLedgerName = (id: string) => ledgersData.find(l => l.id === id)?.name || id

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <ShoppingBag className="h-3 w-3" />
             Procurement & Costs
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Purchase <span className="text-amber-500 italic">Entry Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-amber-500" />
            Manage vendor invoices, material procurement, and operational costs.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-right">
              <p className="text-[10px] font-black uppercase text-amber-700 tracking-widest">Session Spend</p>
              <p className="text-2xl font-black font-mono text-amber-600">
                ₹{sessionPurchases.reduce((acc, p) => acc + p.totalAmount, 0).toLocaleString()}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Column */}
        <Card className="xl:col-span-12 rounded-[2.5rem] border-amber-500/10 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8 px-2">
               <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-amber-500" />
                  <h2 className="text-xl font-bold">New Purchase Invoice</h2>
               </div>
               <Badge variant="outline" className="rounded-full border-amber-500/20 text-amber-600 font-black uppercase text-[10px] px-4 py-1.5 bg-amber-500/5">
                  Procurement Mode Active
               </Badge>
            </div>
            <VoucherForm type="PURCHASE" onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <div className="xl:col-span-12 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <History className="h-5 w-5 text-muted-foreground" />
                 <h2 className="text-lg font-bold">Recent Purchases</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessionPurchases.length > 0 ? (
                sessionPurchases.map((voucher) => (
                  <Card key={voucher.id} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden border-l-4 border-l-amber-500">
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">
                                {voucher.voucherNo}
                             </p>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span>{getProjectName(voucher.projectId)}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black font-mono text-amber-600">₹{voucher.totalAmount.toLocaleString()}</p>
                             <p className="text-[10px] text-muted-foreground font-bold">{voucher.date}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-2 mb-4">
                          {voucher.lines.filter(l => l.drAmount > 0).map((l, idx) => (
                             <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-muted-foreground">Expense Head: {getLedgerName(l.ledgerId)}</span>
                                <span className="text-foreground">₹{l.drAmount.toLocaleString()}</span>
                             </div>
                          ))}
                       </div>

                       <div className="h-px w-full bg-border/20 mb-4" />

                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-tighter text-amber-600">Pending Review</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-amber-500/10 hover:text-amber-600">
                             <Download className="h-4 w-4" />
                          </Button>
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-20 rounded-[3rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground opacity-30">
                   <div className="h-16 w-16 rounded-[2rem] bg-muted/20 flex items-center justify-center">
                      <ShoppingBag className="h-8 w-8" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Purchases Found</p>
                      <p className="text-xs font-medium">Post a purchase invoice to begin procurement tracking.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
