"use client"

import React, { useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { useAuth } from "@/context/AuthContext"
import { ChangeRequestModal } from "@/components/transactions/change-request-modal"
import { EditTransactionModal } from "@/components/transactions/edit-transaction-modal"
import { UnifiedTransaction } from "@/types/unified-transaction"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { StatusIndicator } from "@/components/transactions/status-indicator"
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CreditCard,
  Building2,
  CalendarDays,
  MessageSquarePlus,
  Pencil,
  ShieldCheck,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function DailyEntriesPage() {
  const { user } = useAuth()
  const { transactions } = useAppStore()
  const isUser = user?.roleId === "r2"
  const isAdmin = user?.roleId === "r1" || user?.roleId === "r2"
  
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedEntry, setSelectedEntry] = React.useState<UnifiedTransaction | null>(null)

  const handleAction = (entry: UnifiedTransaction) => {
    setSelectedEntry(entry)
    if (isAdmin) {
      setIsEditModalOpen(true)
    } else {
      setIsChangeRequestModalOpen(true)
    }
  }

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  // Calculate totals
  const stats = useMemo(() => {
    const collections = transactions
      .filter(t => t.type === "Collection")
      .reduce((acc, t) => acc + t.amount, 0)
    
    const expenses = transactions
      .filter(t => t.type === "Expense")
      .reduce((acc, t) => acc + t.amount, 0)
    
    return { collections, expenses }
  }, [transactions])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3">
             <BookOpen className="h-10 w-10 text-primary" />
             Daily Register
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Showing unified entries for <span className="text-foreground font-bold">{today}</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
            <Card className="rounded-2xl border-blue-500/20 bg-blue-500/5 backdrop-blur-md">
               <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                     <TrendingUp className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                     <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Collections</p>
                     <p className="text-xl font-black font-mono">₹{stats.collections.toLocaleString()}</p>
                  </div>
               </CardContent>
            </Card>

           <Card className="rounded-2xl border-rose-500/20 bg-rose-500/5 backdrop-blur-md">
              <CardContent className="p-4 flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                    <TrendingDown className="h-6 w-6" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest">Expenses</p>
                    <p className="text-xl font-black font-mono">₹{stats.expenses.toLocaleString()}</p>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Register Table */}
      <div className="rounded-[2.5rem] glass-card overflow-hidden min-h-[60vh]">
         <Table>
            <TableHeader className="bg-muted/30 h-16">
               <TableRow className="border-border/40">
                  <TableHead className="px-8 font-black uppercase tracking-widest text-[10px] w-[150px]">Time</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] w-[200px]">Type / Project</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px]">Description / Details</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Batch / Mode</TableHead>
                  <TableHead className="px-8 text-right font-black uppercase tracking-widest text-[10px]">Amount</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {transactions.map((tx) => (
                  <TableRow key={tx.id} className="border-border/40 hover:bg-muted/10 transition-colors h-24 group">
                      <TableCell className="px-8">
                         <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-muted-foreground/60">
                               <Clock className="h-3.5 w-3.5" />
                               <span className="font-mono text-[11px] uppercase font-bold tracking-tight">{tx.time}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                               {tx.status === "Success" && !tx.isEdited && <StatusIndicator status="Locked" />}
                               {tx.status === "Pending" && <StatusIndicator status="Pending" />}
                               {tx.isEdited && <StatusIndicator status="Edited" />}
                            </div>
                         </div>
                      </TableCell>
                     <TableCell>
                        <div className="flex flex-col gap-1">
                           <div className="flex items-center gap-2">
                              <span className={cn(
                                 "text-[10px] font-black px-2 py-0.5 rounded-full w-fit border uppercase tracking-tighter",
                                 tx.type === "Collection" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                 tx.type === "Expense" ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                                 "bg-blue-500/10 text-blue-500 border-blue-500/20"
                              )}>
                                 {tx.type}
                              </span>
                           </div>
                            <div className={cn(
                               "flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tight truncate max-w-[180px]",
                               tx.project.toLowerCase().includes("parking") || tx.project.toLowerCase().includes("expressway") ? "text-blue-600" : "text-amber-500"
                            )}>
                               <Building2 className="h-3 w-3 shrink-0" />
                               {tx.project}
                            </div>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div className="space-y-1">
                           <p className="font-medium text-foreground leading-relaxed">{tx.details}</p>
                           {tx.isEdited && (
                              <p className="text-[10px] text-muted-foreground italic font-medium flex items-center gap-1">
                                 <ShieldCheck className="h-3 w-3 text-amber-500" />
                                 Edited by {tx.editedBy} at {tx.editedAt}
                              </p>
                           )}
                        </div>
                     </TableCell>
                     <TableCell className="text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-sm">
                           <CreditCard className="h-3 w-3 text-muted-foreground line-clamp-1" />
                           <span className="text-[10px] font-bold uppercase">{tx.paymentMode}</span>
                        </div>
                     </TableCell>
                     <TableCell className="px-8 text-right">
                        <span className={cn(
                           "text-xl font-black font-mono",
                           tx.type === "Expense" ? "text-rose-500" : 
                           tx.type === "Collection" ? "text-blue-600" : "text-amber-500"
                        )}>
                           {tx.type === "Expense" ? "-" : "+"}₹{tx.amount.toLocaleString()}
                        </span>
                        
                        {(isUser || isAdmin) && (
                           <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleAction(tx)}
                              className={cn(
                                 "ml-4 h-8 w-8 rounded-lg group-hover:scale-110 transition-transform",
                                 isAdmin ? "text-amber-500 hover:bg-amber-500/10" : "text-primary hover:bg-primary/10"
                              )}
                              title={isAdmin ? "Edit Record" : "Request Change"}
                           >
                              {isAdmin ? <Pencil className="h-4 w-4" /> : <MessageSquarePlus className="h-4 w-4" />}
                           </Button>
                        )}
                     </TableCell>
                  </TableRow>
               ))}
               {transactions.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={5} className="h-96 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-4 opacity-20">
                           <BookOpen className="h-16 w-16" />
                           <p className="font-black uppercase tracking-widest">No entries found for today</p>
                        </div>
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </div>

      <ChangeRequestModal 
         isOpen={isChangeRequestModalOpen}
         onClose={() => setIsChangeRequestModalOpen(false)}
         entry={selectedEntry}
      />

      <EditTransactionModal
         isOpen={isEditModalOpen}
         onClose={() => setIsEditModalOpen(false)}
         entry={selectedEntry}
      />

      {/* Legend Footer */}
      <div className="p-8 rounded-[2rem] border border-dashed border-border/40 bg-card/5 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/20" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Inflow</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-rose-500 shadow-lg shadow-rose-500/20" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Outflow</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-3 w-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/20" />
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dispatch</span>
            </div>
         </div>
         <p className="text-[10px] text-muted-foreground font-bold uppercase italic opacity-60">
            Internal Use Only • Confidential Register
         </p>
      </div>
    </div>
  )
}
