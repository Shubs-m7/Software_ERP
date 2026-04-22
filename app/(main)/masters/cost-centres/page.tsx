"use client"

import React, { useState } from "react"
import { Target, Edit2 } from "lucide-react"
import { costCentresData } from "@/lib/mock-data"
import { CostCentre, CostCentreFormValues } from "@/types/cost-centre"
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
import { CostCentreForm } from "./cost-centre-form"
import { MasterHeader } from "@/components/masters/master-header"
import { MasterTableShell } from "@/components/masters/master-table-shell"
import { cn } from "@/lib/utils"

export default function CostCentreMasterPage() {
  const [centres, setCentres] = useState<CostCentre[]>(costCentresData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCentre, setEditingCentre] = useState<CostCentre | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingCentre(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (centre: CostCentre) => {
    setEditingCentre(centre)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: CostCentreFormValues) => {
    if (editingCentre) {
      setCentres(prev =>
        prev.map(c => (c.id === editingCentre.id ? { ...c, ...data } : c))
      )
    } else {
      const newCentre: CostCentre = {
        id: `cc${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }
      setCentres(prev => [...prev, newCentre])
    }
    setIsModalOpen(false)
  }

  const filteredCentres = centres.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.category?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <MasterHeader 
        title="Cost Centre Master"
        description="Track expenses and performance across different departments and project sites."
        icon={Target}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Create Centre"
      />

      <MasterTableShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by centre name or category..."
        totalCount={filteredCentres.length}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Centre Name</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Category</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Manager</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCentres.length > 0 ? (
              filteredCentres.map((centre) => (
                <TableRow key={centre.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8 font-bold text-foreground">{centre.name}</TableCell>
                  <TableCell className="py-5 px-4 text-muted-foreground">{centre.category}</TableCell>
                  <TableCell className="py-5 px-4 text-muted-foreground">{centre.manager || "N/A"}</TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                      centre.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {centre.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(centre)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">No centres found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterTableShell>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2rem]">
          <CostCentreForm 
            initialData={editingCentre}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
