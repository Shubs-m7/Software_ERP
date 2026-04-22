"use client"

import React, { useState } from "react"
import { Car, Edit2, Info, Weight } from "lucide-react"
import { VehicleType, VehicleTypeFormValues } from "@/types/vehicle-type"
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
import { VehicleTypeForm } from "./vehicle-type-form"
import { MasterHeader } from "@/components/masters/master-header"
import { MasterTableShell } from "@/components/masters/master-table-shell"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { cn } from "@/lib/utils"

export default function VehicleTypeMasterPage() {
  const { vehicleTypes, addVehicleType, updateVehicleType } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVType, setEditingVType] = useState<VehicleType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingVType(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (vType: VehicleType) => {
    setEditingVType(vType)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: VehicleTypeFormValues) => {
    if (editingVType) {
      updateVehicleType({ ...editingVType, ...data })
    } else {
      const newVType: VehicleType = {
        id: `vt-${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }
      addVehicleType(newVType)
    }
    setIsModalOpen(false)
  }

  const filteredVehicleTypes = (vehicleTypes || []).filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <MasterHeader 
        title="Vehicle Type Master"
        description="Classify vehicle categories, tiers and capacities."
        icon={Car}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Add Classification"
      />

      <MasterTableShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search classifications..."
        totalCount={filteredVehicleTypes.length}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Vehicle Classification</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Capacity Details</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVehicleTypes.length > 0 ? (
              filteredVehicleTypes.map((vType) => (
                <TableRow key={vType.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                           <Car className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-foreground">{vType.name}</span>
                           <span className="text-xs text-muted-foreground">{vType.description || "No description provided"}</span>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="py-5 px-4 font-mono font-medium text-muted-foreground italic">
                     <div className="flex items-center gap-2">
                        <Weight className="h-3 w-3" />
                        {vType.capacity || "--"}
                     </div>
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                      vType.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {vType.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-right">
                    <PermissionGuard module="masters" action="edit">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => handleOpenEditModal(vType)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-64 text-center">
                   <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                      <Car className="h-10 w-10 mb-2" />
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Classifications Found</p>
                      <p className="text-xs font-medium">Add a vehicle type to begin fleet categorization.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterTableShell>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <VehicleTypeForm 
            initialData={editingVType}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
