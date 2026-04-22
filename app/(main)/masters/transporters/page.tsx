"use client"

import React, { useState } from "react"
import { Truck, Edit2, Phone, User as UserIcon } from "lucide-react"
import { Transporter, TransporterFormValues } from "@/types/transporter"
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
import { TransporterForm } from "./transporter-form"
import { MasterHeader } from "@/components/masters/master-header"
import { MasterTableShell } from "@/components/masters/master-table-shell"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { cn } from "@/lib/utils"

export default function TransporterMasterPage() {
  const { transporters, addTransporter, updateTransporter } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransporter, setEditingTransporter] = useState<Transporter | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingTransporter(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (transporter: Transporter) => {
    setEditingTransporter(transporter)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: TransporterFormValues) => {
    if (editingTransporter) {
      updateTransporter({ ...editingTransporter, ...data })
    } else {
      const newTransporter: Transporter = {
        id: `tr-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }
      addTransporter(newTransporter)
    }
    setIsModalOpen(false)
  }

  const filteredTransporters = (transporters || []).filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <MasterHeader 
        title="Transporter Master"
        description="Manage logistics providers and transportation partners."
        icon={Truck}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Add Transporter"
      />

      <MasterTableShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by name, code or contact..."
        totalCount={filteredTransporters.length}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Transporter</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Code</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Contact</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransporters.length > 0 ? (
              filteredTransporters.map((transporter) => (
                <TableRow key={transporter.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8">
                     <div className="flex flex-col">
                        <span className="font-bold text-foreground">{transporter.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black">{transporter.address || "No Address"}</span>
                     </div>
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 tracking-widest">
                      {transporter.code}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-4 text-muted-foreground">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-foreground text-xs">
                         <UserIcon className="h-3 w-3 text-muted-foreground" />
                         {transporter.contactPerson}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-medium">
                         <Phone className="h-3 w-3 text-muted-foreground" />
                         {transporter.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                      transporter.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {transporter.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-right">
                    <PermissionGuard module="masters" action="edit">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleOpenEditModal(transporter)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center">
                   <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                      <Truck className="h-10 w-10 mb-2" />
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Records Found</p>
                      <p className="text-xs font-medium">Add a transporter to see them here.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterTableShell>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <TransporterForm 
            initialData={editingTransporter}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
