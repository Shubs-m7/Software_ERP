"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/store/use-app-store"
import { useAuth } from "@/context/AuthContext"
import { UnifiedTransaction } from "@/types/unified-transaction"
import { ChangeRequest } from "@/types/change-request"
import { MessageSquarePlus, Send, AlertCircle } from "lucide-react"

interface ChangeRequestModalProps {
  isOpen: boolean
  onClose: () => void
  entry: UnifiedTransaction | null
}

export function ChangeRequestModal({ isOpen, onClose, entry }: ChangeRequestModalProps) {
  const [reason, setReason] = useState("")
  const { user } = useAuth()
  const { addChangeRequest } = useAppStore()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!entry || !reason.trim()) return

    const request: ChangeRequest = {
      id: Math.random().toString(36).substr(2, 9),
      entryId: entry.id,
      entryType: entry.type,
      user: user?.name || "Unknown User",
      reason: reason.trim(),
      status: "PENDING",
      requestedAt: new Date().toLocaleString(),
      details: `${entry.details} (${entry.amount})`
    }

    addChangeRequest(request)
    setReason("")
    onClose()
    alert("Change request submitted for Admin approval.")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2rem] border-border/40 bg-card/60 backdrop-blur-3xl shadow-2xl overflow-hidden max-w-lg">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-primary" />
        
        <DialogHeader className="space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquarePlus className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tight">Request Entry Change</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium">
              Direct editing is restricted. Provide a detailed reason for the requested change.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {entry && (
             <div className="p-4 rounded-2xl bg-muted/20 border border-border/40 space-y-2">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Entry Ref</span>
                   <span className="text-[10px] font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full">{entry.id}</span>
                </div>
                <p className="text-sm font-bold text-foreground">{entry.details}</p>
                <p className="text-xs text-muted-foreground">{entry.project} • {entry.type}</p>
             </div>
          )}

          <div className="space-y-3">
            <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-2">
               Reason for Change <span className="text-rose-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please explain why this entry needs modification..."
              className="rounded-2xl bg-background/50 border-border/40 h-32 focus:ring-primary/20 transition-all resize-none"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
             <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
             <p className="text-[10px] font-bold text-amber-700 leading-tight uppercase">
               Approved requests will allow a one-time modification of this record.
             </p>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-12 px-6 font-bold">
              Discard
            </Button>
            <Button type="submit" className="rounded-xl h-12 px-8 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
              <Send className="h-4 w-4" />
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
