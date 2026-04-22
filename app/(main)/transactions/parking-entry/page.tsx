"use client"

import React, { useState } from "react"
import { ParkingForm } from "@/components/transactions/parking-form"
import { ParkingSlip } from "@/components/transactions/parking-slip"
import { ParkingEntry, ParkingFormValues } from "@/types/parking"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StatusIndicator } from "@/components/transactions/status-indicator"
import { Badge } from "@/components/ui/badge"
import { 
  Car, 
  History, 
  CreditCard, 
  IndianRupee, 
  Clock, 
  TrendingUp, 
  User,
  Ticket
} from "lucide-react"

export default function ParkingEntryPage() {
  const [sessionEntries, setSessionEntries] = useState<ParkingEntry[]>([])
  const [showSlip, setShowSlip] = useState(false)
  const [currentEntry, setCurrentEntry] = useState<ParkingEntry | null>(null)

  const handleFormSubmit = (data: ParkingFormValues) => {
    const newEntry: ParkingEntry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      dateTime: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
    }
    
    setSessionEntries(prev => [newEntry, ...prev])
    setCurrentEntry(newEntry)
    setShowSlip(true)
  }

  const totalSessionCollection = sessionEntries.reduce((acc, curr) => acc + curr.amount, 0)

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
            Parking Entry
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Ticket className="h-4 w-4 text-blue-600" />
            Issue parking slips and manage vehicle entries.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-right">
              <p className="text-[10px] font-black uppercase text-blue-600/60 tracking-widest">Session Collection</p>
              <p className="text-2xl font-black font-mono text-blue-600">₹{totalSessionCollection.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Form Section */}
        <Card className="xl:col-span-7 rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-8 px-2">
               <Car className="h-6 w-6 text-blue-600" />
               <h2 className="text-xl font-bold font-black tracking-tight uppercase">New Vehicle Entry</h2>
            </div>
            <ParkingForm onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>

        {/* History Section */}
        <div className="xl:col-span-5 space-y-6">
           <div className="flex items-center gap-3 px-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-bold">Recent in this Session</h2>
           </div>

           <div className="space-y-4">
              {sessionEntries.length > 0 ? (
                sessionEntries.map((entry) => (
                  <Card 
                    key={entry.id} 
                    className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md hover:bg-card/20 transition-all group overflow-hidden cursor-pointer"
                    onClick={() => {
                        setCurrentEntry(entry)
                        setShowSlip(true)
                    }}
                  >
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <Car className="h-3.5 w-3.5 text-blue-600" />
                                <span className="font-black text-foreground uppercase tracking-tight">{entry.vehicleNumber}</span>
                             </div>
                             <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                <User className="h-3 w-3" />
                                <span>{entry.name}</span>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-xl font-black font-mono text-blue-600">₹{entry.amount.toLocaleString()}</p>
                             <div className="flex items-center justify-end gap-1 text-[9px] text-muted-foreground font-bold uppercase">
                                <Clock className="h-2.5 w-2.5" />
                                <span>{entry.dateTime}</span>
                             </div>
                          </div>
                       </div>
                       
                       <div className="flex items-center justify-between gap-4 mt-2">
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className="rounded-full bg-blue-500/5 border-blue-500/20 text-blue-600 px-3 text-[10px] font-black uppercase">
                                {entry.paymentMode}
                             </Badge>
                             <StatusIndicator status="Locked" className="scale-90" />
                          </div>
                          <div className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-tighter group-hover:text-blue-600 transition-colors">
                             Click to view slip
                          </div>
                       </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="p-12 rounded-[2rem] border-2 border-dashed border-border/40 flex flex-col items-center justify-center text-center gap-4 text-muted-foreground opacity-30">
                   <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center">
                      <Car className="h-6 w-6" />
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">No entries yet</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Slip Modal */}
      <Dialog open={showSlip} onOpenChange={setShowSlip}>
        <DialogContent className="sm:max-w-[450px] bg-transparent border-none p-0 overflow-visible">
          <DialogHeader className="sr-only">
            <DialogTitle>Vehicle Receipt</DialogTitle>
          </DialogHeader>
          {currentEntry && (
            <ParkingSlip 
              entry={currentEntry} 
              onPrint={() => setShowSlip(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
