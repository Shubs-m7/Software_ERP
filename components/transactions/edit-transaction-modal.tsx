"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/store/use-app-store"
import { useAuth } from "@/context/AuthContext"
import { UnifiedTransaction } from "@/types/unified-transaction"
import { projectsData } from "@/lib/mock-data"
import { Save, X, Pencil, IndianRupee, MessageSquare } from "lucide-react"

interface EditTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  entry: UnifiedTransaction | null
}

export function EditTransactionModal({ isOpen, onClose, entry }: EditTransactionModalProps) {
  const { user } = useAuth()
  const { updateTransaction } = useAppStore()
  
  const [formData, setFormData] = useState<Partial<UnifiedTransaction>>({})

  useEffect(() => {
    if (entry) {
      setFormData({ ...entry })
    }
  }, [entry])

  const handleSave = () => {
    if (!entry || !formData.amount) return

    const updatedTx: UnifiedTransaction = {
      ...entry,
      ...formData,
      amount: Number(formData.amount),
      isEdited: true,
      editedBy: user?.name || "Admin",
      editedAt: new Date().toLocaleString(),
    } as UnifiedTransaction

    updateTransaction(updatedTx)
    onClose()
    alert("Transaction updated successfully. Metadata tracked.")
  }

  if (!entry) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-border/40 bg-card/60 backdrop-blur-3xl shadow-3xl overflow-hidden max-w-xl">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-amber-300" />
        
        <DialogHeader className="space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
            <Pencil className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
               Admin Direct Edit
               <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Authorized</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              You are modifying record <span className="text-foreground font-bold font-mono">#{entry.id}</span>. All changes are logged for security audits.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               Project / Site
            </Label>
            <Select 
               value={formData.project} 
               onValueChange={(val) => setFormData(prev => ({ ...prev, project: val }))}
            >
               <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/40 font-bold">
                  <SelectValue placeholder="Select site" />
               </SelectTrigger>
               <SelectContent className="rounded-xl">
                  {projectsData.map(p => (
                     <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                  ))}
               </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               Amount (₹)
            </Label>
            <div className="relative">
               <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input
                  type="number"
                  className="h-12 pl-10 rounded-xl bg-background/50 border-border/40 font-mono font-bold text-lg"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
               />
            </div>
          </div>

          <div className="md:col-span-2 space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               Description / Details
            </Label>
            <div className="relative">
               <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
               <Input
                  className="h-12 pl-10 rounded-xl bg-background/50 border-border/40 font-bold"
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
               />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               Payment Mode
            </Label>
            <Select 
               value={formData.paymentMode} 
               onValueChange={(val) => setFormData(prev => ({ ...prev, paymentMode: val }))}
            >
               <SelectTrigger className="h-12 rounded-xl bg-background/50 border-border/40 font-bold">
                  <SelectValue placeholder="Select mode" />
               </SelectTrigger>
               <SelectContent className="rounded-xl">
                  {["Cash", "UPI", "Bank Transfer", "Cheque"].map(mode => (
                     <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                  ))}
               </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-3">
            <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
               Transaction Type
            </Label>
            <Input
               readOnly
               className="h-12 rounded-xl bg-muted/20 border-border/40 font-bold opacity-50 cursor-not-allowed"
               value={entry.type}
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="ghost" onClick={onClose} className="rounded-xl h-12 px-6 font-bold flex items-center gap-2">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSave} className="rounded-xl h-12 px-8 bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20 flex items-center gap-2">
            <Save className="h-4 w-4" /> Save Modifications
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
