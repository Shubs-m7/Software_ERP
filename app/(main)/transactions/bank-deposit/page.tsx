"use client"

import React, { useState } from "react"
import { Landmark, ArrowUpCircle, History, Building2, Receipt, Download } from "lucide-react"
import { Voucher, VoucherFormValues } from "@/types/voucher"
import { useAppStore } from "@/store/use-app-store"
import { VoucherForm } from "@/components/transactions/voucher-form"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { projectsData, ledgersData } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

export default function BankDepositEntryPage() {
  const { addVoucher } = useAppStore()
  const [sessionDeposits, setSessionDeposits] = useState<Voucher[]>([])

  const handleFormSubmit = (data: VoucherFormValues) => {
    // Bank Deposit: Total is the Debit side (Bank balance increases)
    const totalAmount = data.lines.reduce((acc, l) => acc + l.drAmount, 0)
    
    const newVoucher: Voucher = {
      ...data,
      id: `dep-${Math.random().toString(36).substr(2, 9)}`,
      totalAmount,
      status: "PENDING",
      requestedBy: "Current User",
      requestedAt: new Date().toLocaleString()
    }
    
    addVoucher(newVoucher)
    setSessionDeposits(prev => [newVoucher, ...prev])
    alert("Bank Deposit recorded successfully!")
  }

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id
  const getLedgerName = (id: string) => ledgersData.find(l => l.id === id)?.name || id

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Landmark className="h-3 w-3" />
             Liquidity Management
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Bank <span className="text-blue-500 italic">Deposit Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-blue-500" />
            Record cash deposits into bank accounts and internal fund movements.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-right">
              <p className="text-[10px] font-black uppercase text-blue-700 tracking-widest">Deposited Today</p>
              <p className="text-2xl font-black font-mono text-blue-600">
                ₹{sessionDeposits.reduce((acc, d) => acc + d.totalAmount, 0).toLocaleString()}
              </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Column */}
        <Card className="xl:col-span-12 rounded-[2.5rem] border-blue-500/10 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8 px-2">
               <div className="flex items-center gap-3">
                  <Receipt className="h-6 w-6 text-blue-500" />
                  <h2 className="text-xl font-bold">New Deposit Entry</h2>
               </div>
               <Badge variant="outline" className="rounded-full border-blue-500/20 text-blue-600 font-black uppercase text-[10px] px-4 py-1.5 bg-blue-500/5">
                  Internal Transfer Mode
               </Badge>
            </div>
            <VoucherForm type="CONTRA" onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <div className="xl:col-span-12 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <History className="h-5 w-5 text-muted-foreground" />
                 <h2 className="text-lg font-bold">Recent Deposits</h2>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessionDeposits.length > 0 ? (
                sessionDeposits.map((voucher) => (
                  <Card key={voucher.id} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mb-1">
                                {voucher.voucherNo}
                             </p>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span>{getProjectName(voucher.projectId)}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black font-mono text-blue-600">₹{voucher.totalAmount.toLocaleString()}</p>
                             <p className="text-[10px] text-muted-foreground font-bold">{voucher.date}</p>
                          </div>
                       </div>
                       
                       <div className="space-y-2 mb-4">
                          {voucher.lines.filter(l => l.drAmount > 0).map((l, idx) => (
                             <div key={idx} className="flex justify-between items-center text-[10px] font-bold">
                                <span className="text-muted-foreground">To Bank: {getLedgerName(l.ledgerId)}</span>
                                <span className="text-foreground">₹{l.drAmount.toLocaleString()}</span>
                             </div>
                          ))}
                       </div>

                       <div className="h-px w-full bg-border/20 mb-4" />

                       <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                             <span className="text-[10px] font-black uppercase tracking-tighter text-blue-600">Deposit Slip Active</span>
                          </div>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-blue-500/10 hover:text-blue-600">
                             <Download className="h-4 w-4" />
                          </Button>
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full p-20 rounded-[3rem] border-2 border-dashed border-border/20 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground opacity-30">
                   <div className="h-16 w-16 rounded-[2rem] bg-muted/20 flex items-center justify-center">
                      <Landmark className="h-8 w-8" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Deposits Found</p>
                      <p className="text-xs font-medium italic">Record a bank deposit to begin liquidity tracking.</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
