"use client"

import React from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  Settings, 
  Lock, 
  Calendar, 
  History, 
  ShieldCheck, 
  Save, 
  RotateCcw,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function GlobalSettingsPage() {
  const { settings, updateSettings } = useAppStore()

  const handleUpdate = (updates: any) => {
    updateSettings(updates)
    // In a real app, this would also trigger a notification or API call
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Settings className="h-3 w-3" />
             Enterprise Governance
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Global <span className="text-primary italic">Settings</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Control enterprise windows, fiscal locking, and security policies.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="rounded-2xl h-11 px-6 font-bold gap-2">
              <RotateCcw className="h-4 w-4" /> Reset defaults
           </Button>
           <Button className="rounded-2xl h-11 px-8 bg-primary font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
              <Save className="h-4 w-4 mr-2" /> Save All Changes
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 mb-20">
         
         {/* Fiscal Control Column */}
         <div className="xl:col-span-7 space-y-10">
            <Alert className="rounded-3xl border-primary/20 bg-primary/5 text-primary p-6">
               <AlertCircle className="h-4 w-4" />
               <AlertTitle className="font-black text-xs uppercase tracking-widest leading-none mb-1">Fiscal Integrity Alert</AlertTitle>
               <AlertDescription className="text-xs font-medium opacity-80 italic">
                 Changes to Financial Year or Lock Dates will affect entry availability for all site operators.
               </AlertDescription>
            </Alert>

            <Card className="rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-3xl shadow-xl overflow-hidden">
               <CardHeader className="p-8 border-b border-border/20">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                        <Calendar className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-bold">Fiscal Year Management</CardTitle>
                        <CardDescription>Configure the active reporting cycle for the enterprise.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between gap-10">
                     <div className="space-y-1 max-w-[300px]">
                        <p className="text-sm font-bold">Current Financial Year</p>
                        <p className="text-[11px] text-muted-foreground">Sets the default book period for all new transactions and reporting summaries.</p>
                     </div>
                     <Select value={settings.currentFinancialYear} onValueChange={(v) => handleUpdate({ currentFinancialYear: v })}>
                        <SelectTrigger className="w-[180px] h-12 rounded-xl font-mono font-bold">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                           <SelectItem value="2023-24">FY 2023-24</SelectItem>
                           <SelectItem value="2024-25">FY 2024-25</SelectItem>
                           <SelectItem value="2025-26">FY 2025-26</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>

                  <div className="h-px w-full bg-border/20" />

                  <div className="flex items-center justify-between gap-10">
                     <div className="space-y-1 max-w-[300px]">
                        <p className="text-sm font-bold text-primary flex items-center gap-2">
                           <Lock className="h-4 w-4" /> Entry Lock Date
                        </p>
                        <p className="text-[11px] text-muted-foreground">Previous entries before this date will be read-only and require elevation to modify.</p>
                     </div>
                     <Input 
                        type="date" 
                        className="w-[180px] h-12 rounded-xl font-mono text-center" 
                        value={settings.lockUntilDate}
                        onChange={(e) => handleUpdate({ lockUntilDate: e.target.value })}
                     />
                  </div>
               </CardContent>
            </Card>

            <Card className="rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-3xl shadow-xl overflow-hidden">
               <CardHeader className="p-8 border-b border-border/20">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                        <History className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-bold">Backdating Policies</CardTitle>
                        <CardDescription>Parameters for recording historical data entries.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-10">
                  <div className="flex items-center justify-between gap-10">
                     <div className="space-y-1 max-w-[300px]">
                        <p className="text-sm font-bold italic">Allow Backdated Vouchers</p>
                        <p className="text-[11px] text-muted-foreground">Enable staff to record entries with a past date (within the limit window).</p>
                     </div>
                     <Switch 
                        checked={settings.allowBackdatedEntries} 
                        onCheckedChange={(v: boolean) => handleUpdate({ allowBackdatedEntries: v })}
                        className="scale-125 data-[state=checked]:bg-primary"
                     />
                  </div>

                  <div className="h-px w-full bg-border/20" />

                  <div className="flex items-center justify-between gap-10">
                     <div className="space-y-1 max-w-[300px]">
                        <p className="text-sm font-bold">Backdate Window Limit</p>
                        <p className="text-[11px] text-muted-foreground">Maximum number of days an entry can be backdated without admin override.</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <Input 
                          type="number" 
                          className="w-[80px] h-12 rounded-xl font-mono text-center" 
                          value={settings.backdateLimitDays}
                          onChange={(e) => handleUpdate({ backdateLimitDays: parseInt(e.target.value) })}
                        />
                        <span className="text-[10px] font-black uppercase text-muted-foreground">Days</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Security Control Column */}
         <div className="xl:col-span-5 space-y-10">
            <Card className="rounded-[2.5rem] border border-border/40 bg-card/10 backdrop-blur-md shadow-xl overflow-hidden glass-card">
               <CardHeader className="p-8 border-b border-border/20">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                        <ShieldCheck className="h-6 w-6" />
                     </div>
                     <div>
                        <CardTitle className="text-xl font-bold italic">Audit Compliance</CardTitle>
                        <CardDescription>Security and modification protocols.</CardDescription>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-8 space-y-10">
                  <div className="flex flex-col gap-6">
                     <div className="flex items-center justify-between">
                        <p className="text-sm font-bold">Require Edit Approval</p>
                        <Switch 
                           checked={settings.requireApprovalForEdits} 
                           onCheckedChange={(v: boolean) => handleUpdate({ requireApprovalForEdits: v })}
                        />
                     </div>
                     <p className="text-[11px] text-muted-foreground bg-muted/30 p-4 rounded-2xl italic leading-relaxed">
                        When enabled, any modification to a posted voucher will be held in "PENDING" status until an administrator reviews and approves the change trail.
                     </p>
                  </div>

                  <div className="h-px w-full bg-border/20" />

                  <Alert className="rounded-2xl border-amber-500/10 bg-amber-500/5 text-amber-700 p-6">
                     <ShieldCheck className="h-4 w-4" />
                     <AlertTitle className="font-black text-xs uppercase tracking-widest leading-none mb-1">Traceability Mode</AlertTitle>
                     <AlertDescription className="text-xs font-medium opacity-80">
                       Platform-wide audit logging is currently ACTIVE. All administrative movements are being tracked.
                     </AlertDescription>
                  </Alert>
               </CardContent>
            </Card>

            <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex flex-col items-center justify-center text-center gap-4">
               <div className="h-16 w-16 rounded-[2rem] bg-card border border-primary/20 flex items-center justify-center shadow-2xl">
                  <Settings className="h-8 w-8 text-primary animate-spin-slow" />
               </div>
               <div className="space-y-1">
                  <p className="text-lg font-black uppercase tracking-tighter">Enterprise MIS Engine</p>
                  <p className="text-xs font-medium text-muted-foreground italic">Powered by Zenith v2.4.0 • Enterprise License</p>
               </div>
            </div>
         </div>

      </div>
    </div>
  )
}
