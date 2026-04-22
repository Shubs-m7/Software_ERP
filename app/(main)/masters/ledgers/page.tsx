"use client"

import React, { useState } from "react"
import { CreditCard, Edit2 } from "lucide-react"
import { ledgersData, ledgerGroupsData } from "@/lib/mock-data"
import { Ledger, LedgerFormValues } from "@/types/ledger"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { LedgerForm } from "./ledger-form"
import { MasterHeader } from "@/components/masters/master-header"
import { MasterTableShell } from "@/components/masters/master-table-shell"
import { cn } from "@/lib/utils"

export default function LedgerMasterPage() {
  const [ledgers, setLedgers] = useState<Ledger[]>(ledgersData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLedger, setEditingLedger] = useState<Ledger | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingLedger(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (ledger: Ledger) => {
    setEditingLedger(ledger)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: LedgerFormValues) => {
    if (editingLedger) {
      setLedgers(prev =>
        prev.map(l => (l.id === editingLedger.id ? { ...l, ...data } : l))
      )
    } else {
      const newLedger: Ledger = {
        id: `l${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }
      setLedgers(prev => [...prev, newLedger])
    }
    setIsModalOpen(false)
  }

  const getGroupName = (id: string) => {
    return ledgerGroupsData.find(g => g.id === id)?.name || "N/A"
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(val)
  }

  const filteredLedgers = ledgers.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getGroupName(l.groupId).toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <MasterHeader 
        title="Ledger Master"
        description="Core accounts registry for your financial transactions."
        icon={CreditCard}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Create Ledger"
      />

      <MasterTableShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by ledger name or group..."
        totalCount={filteredLedgers.length}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Ledger Name</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Group</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground text-right">Opening Balance</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLedgers.length > 0 ? (
              filteredLedgers.map((ledger) => (
                <TableRow key={ledger.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8 font-bold text-foreground">{ledger.name}</TableCell>
                  <TableCell className="py-5 px-4 text-muted-foreground">{getGroupName(ledger.groupId)}</TableCell>
                  <TableCell className="py-5 px-4 text-right font-mono">
                    <span className="font-bold">{formatCurrency(ledger.openingBalance)}</span>
                    <span className={cn(
                      "ml-1 text-[10px] font-extrabold uppercase",
                      ledger.balanceType === "Dr" ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {ledger.balanceType}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                      ledger.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {ledger.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(ledger)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">No ledgers found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterTableShell>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2rem]">
          <LedgerForm 
            initialData={editingLedger}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
