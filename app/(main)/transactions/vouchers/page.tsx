"use client"

import React from "react"
import { 
  Plus, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Shuffle, 
  BookOpen, 
  ShoppingCart, 
  Tag, 
  Calculator 
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VoucherForm } from "@/components/transactions/voucher-form"
import { useAppStore } from "@/store/use-app-store"
import { VoucherFormValues, Voucher } from "@/types/voucher"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function VoucherHubPage() {
  const { addVoucher } = useAppStore()

  const handleFormSubmit = (data: VoucherFormValues) => {
    const drTotal = data.lines.reduce((acc, l) => acc + (l.drAmount || 0), 0)
    const crTotal = data.lines.reduce((acc, l) => acc + (l.crAmount || 0), 0)
    
    // In accounting, totalAmount is one side of the balanced entry
    const totalAmount = Math.max(drTotal, crTotal)
    
    const newVoucher: Voucher = {
      ...data,
      id: `v-${Math.random().toString(36).substr(2, 9)}`,
      totalAmount,
      status: "PENDING",
      requestedBy: "Current User",
      requestedAt: new Date().toLocaleString()
    }
    
    addVoucher(newVoucher)
    alert(`${data.type} Voucher posted successfully!`)
  }

  const voucherTypes = [
    { value: "RECEIPT", label: "Receipt", icon: ArrowDownLeft, desc: "Money Received" },
    { value: "PAYMENT", label: "Payment", icon: ArrowUpRight, desc: "Money Paid" },
    { value: "CONTRA", label: "Contra", icon: Shuffle, desc: "Bank/Cash Transfer" },
    { value: "JOURNAL", label: "Journal", icon: BookOpen, desc: "Adjustment Entry" },
    { value: "SALES", label: "Sales", icon: Tag, desc: "Revenue Posting" },
    { value: "PURCHASE", label: "Purchase", icon: ShoppingCart, desc: "Asset/Expense Onboarding" },
  ]

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Calculator className="h-3 w-3" />
             Fiscal Control Hub
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Executive <span className="text-primary italic">Voucher Console</span>
          </h1>
          <p className="text-muted-foreground font-medium">
            Post, adjust, and reconcile terminal financial events across all site ledgers.
          </p>
        </div>
      </div>

      <Tabs defaultValue="CONTRA" className="w-full">
        <div className="flex flex-col gap-8">
           <TabsList className="h-24 bg-card/20 backdrop-blur-xl border border-border/40 p-2 rounded-[2rem] flex justify-between gap-2 overflow-x-auto no-scrollbar">
              {voucherTypes.map((type) => (
                <TabsTrigger 
                  key={type.value} 
                  value={type.value}
                  className="flex-1 flex flex-col items-center justify-center gap-2 rounded-2xl transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-xl shadow-primary/20 min-w-[120px]"
                >
                  <type.icon className="h-5 w-5" />
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] font-black uppercase tracking-tight">{type.label}</span>
                     <span className="text-[8px] opacity-60 font-bold hidden md:block">{type.desc}</span>
                  </div>
                </TabsTrigger>
              ))}
           </TabsList>

           {voucherTypes.map((type) => (
             <TabsContent key={type.value} value={type.value} className="mt-0 animate-in slide-in-from-bottom-4 duration-500">
                <Card className="rounded-[2.5rem] border-primary/10 bg-card/10 backdrop-blur-md shadow-2xl overflow-hidden border-glass">
                   <CardContent className="p-8">
                      <div className="flex items-center justify-between mb-10 px-2">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                               <type.icon className="h-6 w-6" />
                            </div>
                            <div>
                               <h2 className="text-xl font-black tracking-tight">{type.label} Voucher</h2>
                               <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{type.desc}</p>
                            </div>
                         </div>
                         <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary font-black uppercase text-[10px]">
                            Live Voucher Stream
                         </Badge>
                      </div>
                      <VoucherForm type={type.value as any} onSubmit={handleFormSubmit} />
                   </CardContent>
                </Card>
             </TabsContent>
           ))}
        </div>
      </Tabs>
    </div>
  )
}
