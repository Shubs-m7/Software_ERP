"use client"

import React, { useState } from "react"
import { Shield, Edit2, ShieldAlert, CheckCircle2, XCircle } from "lucide-react"
import { DynamicRole } from "@/types/settings"
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
import { RoleForm } from "./role-form"
import { MasterHeader } from "@/components/masters/master-header"
import { MasterTableShell } from "@/components/masters/master-table-shell"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { cn } from "@/lib/utils"

export default function RoleMasterPage() {
  const { roles: dynamicRoles, updateRole } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingRole(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (role: any) => {
    setEditingRole(role)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    const role: any = {
      id: editingRole?.id || `role-${Math.random().toString(36).substr(2, 9)}`,
      ...data
    }
    updateRole(role)
    setIsModalOpen(false)
  }

  const filteredRoles = (dynamicRoles || []).filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const modules = ["dashboard", "masters", "transactions", "reports", "users"]

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <MasterHeader 
        title="Role & Permission Master"
        description="Define and govern access policies for enterprise roles."
        icon={Shield}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Create New Role"
      />

      <MasterTableShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search roles by designation..."
        totalCount={filteredRoles.length}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Enterprise Role</TableHead>
              {modules.map(m => (
                <TableHead key={m} className="py-6 px-4 font-black uppercase text-[9px] tracking-widest text-center text-muted-foreground whitespace-nowrap">
                   {m} Access
                </TableHead>
              ))}
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role) => (
                <TableRow key={role.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8">
                     <span className="font-black italic text-foreground tracking-tight">{role.name}</span>
                  </TableCell>
                  {modules.map(m => {
                    const p = role.permissions[m]
                    const hasSome = p && (p.view || p.create || p.edit || p.delete)
                    return (
                      <TableCell key={m} className="py-5 px-4 text-center">
                        {hasSome ? (
                          <div className="flex items-center justify-center gap-1">
                             <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                             <span className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1 opacity-20">
                             <XCircle className="h-4 w-4 text-rose-500" />
                          </div>
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell className="py-5 px-8 text-right">
                    <PermissionGuard module="users" action="edit">
                      <Button variant="ghost" size="icon" className="hover:bg-primary/20 hover:text-primary transition-all" onClick={() => handleOpenEditModal(role)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={modules.length + 2} className="h-64 text-center">
                   <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                      <ShieldAlert className="h-10 w-10 mb-2" />
                      <p className="text-sm font-black uppercase tracking-widest text-primary">No Governance Roles Defined</p>
                      <p className="text-xs font-medium italic">Define custom roles to manage platform security.</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterTableShell>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2.5rem] p-0 overflow-hidden shadow-3xl">
          <RoleForm 
            initialData={editingRole}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
