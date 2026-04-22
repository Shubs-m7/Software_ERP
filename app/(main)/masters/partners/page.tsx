"use client"

import React, { useState } from "react"
import { Users, Edit2 } from "lucide-react"
import { Partner, PartnerFormValues } from "@/types/partner"
import { useAppStore } from "@/store/use-app-store"
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
import { PartnerForm } from "./partner-form"
import { MasterHeader } from "@/components/masters/master-header"
import { MasterTableShell } from "@/components/masters/master-table-shell"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { cn } from "@/lib/utils"

export default function PartnerMasterPage() {
  const { partners, addPartner, updatePartner } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingPartner(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (partner: Partner) => {
    setEditingPartner(partner)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: PartnerFormValues) => {
    if (editingPartner) {
      updatePartner({ ...editingPartner, ...data })
    } else {
      const newPartner: Partner = {
        id: `par-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }
      addPartner(newPartner)
    }
    setIsModalOpen(false)
  }

  const filteredPartners = (partners || []).filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mobile.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <MasterHeader 
        title="Partner Master"
        description="Manage vendors, customers, and business partners."
        icon={Users}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Create Partner"
      />

      <MasterTableShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name or mobile..."
        totalCount={filteredPartners.length}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Partner Name</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Mobile</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground text-center">Share %</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground text-right">Opening Capital</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <TableRow key={partner.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{partner.name}</span>
                      <span className="text-xs text-muted-foreground">{partner.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-4 font-medium text-muted-foreground">{partner.mobile}</TableCell>
                  <TableCell className="py-5 px-4 text-center">
                    <span className="font-mono font-black text-primary">
                      {partner.shareRatio?.toFixed(2)}%
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-4 text-right font-mono font-bold">
                    ₹{partner.openingCapital?.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                      partner.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {partner.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-right">
                    <PermissionGuard module="masters" action="edit">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(partner)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center text-muted-foreground">No partners found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterTableShell>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2rem]">
          <PartnerForm 
            initialData={editingPartner}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
