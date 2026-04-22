"use client"

import React, { useState } from "react"
import { FolderTree, Edit2 } from "lucide-react"
import { ledgerGroupsData } from "@/lib/mock-data"
import { LedgerGroup, LedgerGroupFormValues } from "@/types/ledger-group"
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
import { LedgerGroupForm } from "./ledger-group-form"
import { MasterHeader } from "@/components/masters/master-header"
import { MasterTableShell } from "@/components/masters/master-table-shell"
import { PermissionGuard } from "@/components/auth/permission-guard"
import { cn } from "@/lib/utils"

export default function LedgerGroupMasterPage() {
  const [groups, setGroups] = useState<LedgerGroup[]>(ledgerGroupsData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<LedgerGroup | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleOpenCreateModal = () => {
    setEditingGroup(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (group: LedgerGroup) => {
    setEditingGroup(group)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: LedgerGroupFormValues) => {
    if (editingGroup) {
      setGroups(prev =>
        prev.map(g => (g.id === editingGroup.id ? { ...g, ...data } : g))
      )
    } else {
      const newGroup: LedgerGroup = {
        id: `lg${Math.random().toString(36).substr(2, 9)}`,
        ...data,
      }
      setGroups(prev => [...prev, newGroup])
    }
    setIsModalOpen(false)
  }

  const getParentName = (parentId?: string) => {
    if (!parentId) return "Primary"
    return ledgerGroupsData.find(g => g.id === parentId)?.name || "Primary"
  }

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.nature.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      <MasterHeader 
        title="Ledger Group Master"
        description="Organize your accounts into logical groups and categories."
        icon={FolderTree}
        onCreateClick={handleOpenCreateModal}
        createButtonText="Create Group"
      />

      <MasterTableShell
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search by group name or nature..."
        totalCount={filteredGroups.length}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="py-6 px-8 font-bold text-foreground">Group Name</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Nature</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Parent Group</TableHead>
              <TableHead className="py-6 px-4 font-bold text-foreground">Status</TableHead>
              <TableHead className="py-6 px-8 text-right font-bold text-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow key={group.id} className="border-border/40 hover:bg-muted/20 transition-colors group">
                  <TableCell className="py-5 px-8 font-bold text-foreground">{group.name}</TableCell>
                  <TableCell className="py-5 px-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded border",
                      group.nature === "Asset" ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                      group.nature === "Liability" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                      group.nature === "Income" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                      "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}>
                      {group.nature}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-4 text-muted-foreground">{getParentName(group.parentGroup)}</TableCell>
                  <TableCell className="py-5 px-4">
                    <div className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold",
                      group.status === "Active" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    )}>
                      {group.status}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-right">
                    <PermissionGuard module="masters" action="edit">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(group)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </PermissionGuard>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-64 text-center text-muted-foreground">No groups found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </MasterTableShell>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-3xl border-border/40 rounded-[2rem]">
          <LedgerGroupForm 
            initialData={editingGroup}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
