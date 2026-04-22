"use client"

import React from "react"
import { ParkingEntry } from "@/types/parking"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Printer, Car, User, Clock, CreditCard, IndianRupee, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ParkingSlipProps {
  entry: ParkingEntry
  onPrint?: () => void
}

export function ParkingSlip({ entry, onPrint }: ParkingSlipProps) {
  return (
    <div className="flex flex-col gap-6 animate-in zoom-in-95 duration-300">
      <div className="print-area">
        <Card className="border-none bg-white/95 dark:bg-card/50 backdrop-blur-3xl shadow-3xl relative overflow-hidden group">
          {/* Aesthetic Background Elements */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />
          <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-1 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl font-black tracking-tight uppercase text-foreground leading-none">Parking Receipt</h2>
                <p className="text-[10px] text-primary font-black tracking-[0.2em] uppercase opacity-80">Software Solutions</p>
              </div>
            </div>

            <div className="border-t border-dashed border-border/60 relative">
               <div className="absolute -left-12 -top-2.5 h-5 w-5 rounded-full bg-background border-r border-border/40" />
               <div className="absolute -right-12 -top-2.5 h-5 w-5 rounded-full bg-background border-l border-border/40" />
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-0.5">Vehicle Number</p>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Car className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="font-black text-xl tracking-tighter text-foreground">{entry.vehicleNumber}</span>
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest px-0.5">Date & Time</p>
                  <div className="flex items-center justify-end gap-2">
                    <span className="font-bold text-xs text-foreground">{entry.dateTime}</span>
                    <div className="h-7 w-7 rounded-lg bg-primary/5 flex items-center justify-center">
                      <Clock className="h-3.5 w-3.5 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Driver / Registered Name</p>
                  <div className="flex items-center gap-2">
                     <User className="h-3.5 w-3.5 text-primary/60" />
                     <span className="font-bold text-sm text-foreground">{entry.name}</span>
                  </div>
                </div>
                <div className="h-8 w-1 rounded-full bg-border/40" />
                <div className="text-right">
                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Mode</p>
                   <Badge variant="outline" className="rounded-full bg-white dark:bg-primary/10 border-border text-primary font-black px-2 py-0 text-[9px] uppercase shadow-sm">
                     {entry.paymentMode}
                   </Badge>
                </div>
              </div>

              <div className="p-4 rounded-[1.5rem] bg-primary text-primary-foreground shadow-xl shadow-primary/20 relative overflow-hidden group/amount">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                 <div className="relative flex items-center justify-between">
                    <div className="space-y-0.5">
                       <p className="text-[9px] font-black uppercase tracking-widest opacity-70">Total Paid</p>
                       <p className="text-[10px] font-bold opacity-90 leading-none">Validated Receipt</p>
                    </div>
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-base font-medium opacity-70">₹</span>
                      <span className="text-3xl font-black font-mono tracking-tighter">
                        {entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                 </div>
              </div>
            </div>

            <div className="border-t border-dashed border-border/60" />

            <div className="text-center space-y-1">
              <p className="text-[8px] text-muted-foreground font-bold tracking-tight">Thank you for using our digital parking!</p>
              <div className="flex items-center justify-center gap-2">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                 <p className="text-[8px] text-muted-foreground/40 uppercase font-black tracking-[0.2em]">Digitally Generated Receipt</p>
                 <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center gap-4 no-print">
        <Button 
          onClick={() => window.print()} 
          className="rounded-xl h-12 px-8 flex items-center gap-2 bg-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Printer className="h-4 w-4" />
          Print Slip
        </Button>
        {onPrint && (
           <Button variant="ghost" onClick={onPrint} className="rounded-xl h-12 px-8 font-bold">
             Close
           </Button>
        )}
      </div>
    </div>
  )
}
