"use client"

import React, { useState } from "react"
import { History, Shield, Search, Download, Filter, User as UserIcon, Activity, ArrowRightLeft } from "lucide-react"
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function AuditLogHubPage() {
  const { auditLogs } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = (auditLogs || []).filter(log => 
    log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.module.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-20 px-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Shield className="h-3 w-3" />
             Enterprise Accountability
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Audit <span className="text-primary italic">Log Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Complete traceability trail for every system modification and administrative action.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="p-3 bg-muted/40 rounded-2xl border border-border/40 flex items-center gap-4">
              <Search className="h-5 w-5 text-muted-foreground/50" />
              <Input 
                placeholder="Search logs by action or user..." 
                className="h-9 bg-transparent border-none shadow-none font-bold text-sm min-w-[250px] p-0 focus-visible:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <Button className="h-14 w-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 hover:scale-110 transition-all">
              <Download className="h-6 w-6" />
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10">
         <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="p-8 border-b border-border/20 flex flex-row items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary shadow-inner">
                     <Activity className="h-6 w-6" />
                  </div>
                  <div>
                     <CardTitle className="text-xl font-bold italic">Modification Matrix</CardTitle>
                     <CardDescription>Live feed of transactional and administrative changes.</CardDescription>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <Badge variant="outline" className="rounded-full px-4 h-9 font-black uppercase text-[10px] border-primary/20 text-primary bg-primary/5">
                     {filteredLogs.length} Records Found
                  </Badge>
                  <Button variant="outline" className="rounded-xl font-bold h-9 gap-2">
                     <Filter className="h-4 w-4" /> Filters
                  </Button>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader className="bg-muted/30">
                     <TableRow className="border-border/40 hover:bg-transparent">
                        <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest leading-none">Timestamp</TableHead>
                        <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest leading-none">Executor</TableHead>
                        <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest leading-none">Action Type</TableHead>
                        <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest leading-none">Target Module</TableHead>
                        <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest leading-none">Modification Summary</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {filteredLogs.length > 0 ? (
                       filteredLogs.map((log) => (
                         <TableRow key={log.id} className="border-border/40 hover:bg-muted/20 transition-all group">
                            <TableCell className="py-6 px-8">
                               <div className="flex flex-col gap-1">
                                  <span className="font-bold text-foreground text-xs">{log.timestamp.split(',')[0]}</span>
                                  <span className="text-[10px] text-muted-foreground font-black">{log.timestamp.split(',')[1]}</span>
                               </div>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                               <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border/40">
                                     <UserIcon className="h-3 w-3 text-muted-foreground" />
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="text-xs font-black text-foreground italic">{log.userName}</span>
                                     <span className="text-[8px] font-black uppercase text-primary tracking-widest leading-none">{log.userRole}</span>
                                  </div>
                               </div>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                               <Badge className={cn(
                                 "text-[9px] font-black uppercase tracking-widest px-2 h-5 border-none",
                                 log.action === "CREATE" ? "bg-emerald-500/10 text-emerald-600" :
                                 log.action === "UPDATE" ? "bg-blue-500/10 text-blue-600" :
                                 log.action === "DELETE" ? "bg-rose-500/10 text-rose-600" :
                                 "bg-amber-500/10 text-amber-600"
                               )}>
                                  {log.action}
                               </Badge>
                            </TableCell>
                            <TableCell className="py-6 px-4">
                               <div className="flex items-center gap-2">
                                  <ArrowRightLeft className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-[10px] font-black text-foreground uppercase tracking-tighter">{log.module}</span>
                               </div>
                            </TableCell>
                            <TableCell className="py-6 px-8 font-medium text-xs text-muted-foreground italic leading-relaxed group-hover:text-foreground transition-colors">
                               {log.description}
                            </TableCell>
                         </TableRow>
                       ))
                     ) : (
                       <TableRow>
                          <TableCell colSpan={5} className="h-64 text-center">
                             <div className="flex flex-col items-center justify-center gap-2 opacity-30">
                                <Activity className="h-10 w-10 mb-2" />
                                <p className="text-sm font-black uppercase tracking-widest text-primary">No Modifications Logged</p>
                                <p className="text-xs font-medium italic">Perform system actions to begin audit trail.</p>
                             </div>
                          </TableCell>
                       </TableRow>
                     )}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         <div className="p-10 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-border/40 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-6">
               <div className="h-16 w-16 rounded-[2rem] bg-card border border-primary/20 flex items-center justify-center text-primary shadow-2xl">
                  <Shield className="h-8 w-8" />
               </div>
               <div className="space-y-1">
                  <p className="text-xl font-black italic tracking-tighter uppercase">Enterprise Integrity Suite</p>
                  <p className="text-sm font-medium text-muted-foreground">This log is tamper-evident and serves as the authoritative source for regulatory compliance.</p>
               </div>
            </div>
            <Button className="rounded-2xl h-14 px-10 bg-primary text-primary-foreground font-black hover:scale-105 transition-all shadow-xl shadow-primary/20 uppercase tracking-widest text-[10px]">
               Generate Compliance Export
            </Button>
         </div>
      </div>
    </div>
  )
}
