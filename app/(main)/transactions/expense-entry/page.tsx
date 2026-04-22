"use client"

import React, { useState } from "react"
import { ExpenseForm } from "@/components/transactions/expense-form"
import { ExpenseEntry, ExpenseFormValues } from "@/types/expense"
import { projectsData, ledgersData } from "@/lib/mock-data"
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
import { Receipt, History, Landmark, Building2, TrendingDown } from "lucide-react"

export default function ExpenseEntryPage() {
  const [sessionExpenses, setSessionExpenses] = useState<ExpenseEntry[]>([])

  const handleFormSubmit = (data: ExpenseFormValues) => {
    const newEntry: ExpenseEntry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    }
    setSessionExpenses(prev => [newEntry, ...prev])
    alert("Expense recorded successfully!")
  }

  const getProjectName = (id: string) => projectsData.find(p => p.id === id)?.name || id
  const getLedgerName = (id: string) => ledgersData.find(l => l.id === id)?.name || id

  const totalSessionExpense = sessionExpenses.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Expense Entry
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-rose-500" />
            Record and categorize your operational and administrative costs.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-right">
              <p className="text-[10px] font-black uppercase text-rose-700 tracking-widest">Session Total</p>
              <p className="text-2xl font-black font-mono text-rose-600">₹{totalSessionExpense.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Section */}
        <Card className="xl:col-span-7 rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8 px-2">
               <Receipt className="h-6 w-6 text-primary" />
               <h2 className="text-xl font-bold">New Expense Voucher</h2>
            </div>
            <ExpenseForm onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="xl:col-span-5 space-y-6">
           <div className="flex items-center gap-3 px-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold">Recent in this Session</h2>
           </div>

           <div className="space-y-4">
              {sessionExpenses.length > 0 ? (
                sessionExpenses.map((expense) => (
                  <Card key={expense.id} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden">
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <Landmark className="h-3.5 w-3.5 text-primary" />
                                <span className="font-bold text-foreground">{getLedgerName(expense.ledgerId)}</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                <span>{getProjectName(expense.projectId)}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black font-mono text-rose-500">₹{expense.amount.toLocaleString()}</p>
                             <p className="text-[10px] text-muted-foreground font-bold">{expense.date}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between gap-4">
                          <Badge variant="outline" className="rounded-full bg-primary/5 border-primary/20 text-primary px-3">
                            {expense.paymentMode}
                          </Badge>
                          {expense.remark && (
                             <p className="text-xs text-muted-foreground italic truncate max-w-[200px]">
                               "{expense.remark}"
                             </p>
                          )}
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-12 rounded-[2rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground opacity-30">
                   <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center">
                      <Receipt className="h-6 w-6" />
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">No entries yet</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
