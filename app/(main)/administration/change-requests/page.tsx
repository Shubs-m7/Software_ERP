"use client"

import React from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  FileText,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChangeRequestsPage() {
  const { changeRequests, updateChangeRequestStatus } = useAppStore()

  const pendingRequests = changeRequests.filter(r => r.status === "PENDING")
  const archivedRequests = changeRequests.filter(r => r.status !== "PENDING")

  const handleApprove = (id: string) => {
    updateChangeRequestStatus(id, "APPROVED")
    alert("Request Approved. User can now modify the entry.")
  }

  const handleReject = (id: string) => {
    updateChangeRequestStatus(id, "REJECTED")
    alert("Request Rejected.")
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tighter text-foreground flex items-center gap-3">
           <ShieldCheck className="h-8 w-8 text-primary" />
           Change Request Management
        </h1>
        <p className="text-muted-foreground font-medium">
          Review and approve requests from users to modify saved transaction entries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="rounded-2xl border-primary/20 bg-primary/5">
            <CardContent className="p-6 flex items-center gap-4">
               <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                  <Clock className="h-6 w-6" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-primary tracking-widest">Pending</p>
                  <p className="text-2xl font-black font-mono">{pendingRequests.length}</p>
               </div>
            </CardContent>
         </Card>
      </div>

      <div className="space-y-6">
         <div className="flex items-center gap-2 px-2">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl font-bold">Pending Reviews</h2>
         </div>

         <div className="rounded-[2rem] border border-border/40 bg-card/10 backdrop-blur-3xl shadow-xl overflow-hidden">
            <Table>
               <TableHeader className="bg-muted/30 h-16">
                  <TableRow className="border-border/40">
                     <TableHead className="px-8 font-black uppercase tracking-widest text-[10px]">Requested At</TableHead>
                     <TableHead className="font-black uppercase tracking-widest text-[10px]">User & Entry</TableHead>
                     <TableHead className="font-black uppercase tracking-widest text-[10px]">Reason for Change</TableHead>
                     <TableHead className="px-8 text-right font-black uppercase tracking-widest text-[10px]">Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {pendingRequests.map((request) => (
                     <TableRow key={request.id} className="border-border/40 hover:bg-muted/5 transition-colors h-24">
                        <TableCell className="px-8">
                           <div className="flex flex-col gap-1">
                              <span className="text-xs font-bold text-foreground">{request.requestedAt.split(',')[0]}</span>
                              <span className="text-[10px] text-muted-foreground">{request.requestedAt.split(',')[1]}</span>
                           </div>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                 <User className="h-3 w-3 text-primary" />
                                 <span className="text-sm font-bold">{request.user}</span>
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-black">
                                 <FileText className="h-3 w-3" />
                                 {request.entryType} #{request.entryId}
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                           <p className="text-sm font-medium text-muted-foreground line-clamp-2 italic">
                              "{request.reason}"
                           </p>
                        </TableCell>
                        <TableCell className="px-8">
                           <div className="flex items-center justify-end gap-3">
                              <Button 
                                 size="sm" 
                                 className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold gap-2 px-4 h-10 shadow-lg shadow-emerald-500/20"
                                 onClick={() => handleApprove(request.id)}
                              >
                                 <CheckCircle2 className="h-4 w-4" />
                                 Approve
                              </Button>
                              <Button 
                                 size="sm" 
                                 variant="outline"
                                 className="rounded-xl border-rose-500/50 text-rose-500 hover:bg-rose-500/10 font-bold gap-2 px-4 h-10"
                                 onClick={() => handleReject(request.id)}
                              >
                                 <XCircle className="h-4 w-4" />
                                 Reject
                              </Button>
                           </div>
                        </TableCell>
                     </TableRow>
                  ))}
                  {pendingRequests.length === 0 && (
                     <TableRow>
                        <TableCell colSpan={4} className="h-48 text-center text-muted-foreground opacity-30">
                           <p className="font-black uppercase tracking-widest text-xs">No pending change requests</p>
                        </TableCell>
                     </TableRow>
                  )}
               </TableBody>
            </Table>
         </div>
      </div>

      {archivedRequests.length > 0 && (
         <div className="space-y-6">
            <h2 className="text-xl font-bold px-2 text-muted-foreground opacity-60">History</h2>
            <div className="rounded-[2rem] border border-border/20 bg-card/5 opacity-80 overflow-hidden">
               <Table>
                  <TableBody>
                     {archivedRequests.map((request) => (
                        <TableRow key={request.id} className="border-border/10 h-16">
                           <TableCell className="px-8 opacity-60 font-mono text-xs w-[150px]">{request.requestedAt}</TableCell>
                           <TableCell className="font-bold text-sm w-[200px]">{request.user}</TableCell>
                           <TableCell className="text-xs italic text-muted-foreground truncate max-w-[400px]">"{request.reason}"</TableCell>
                           <TableCell className="px-8 text-right">
                              <Badge className={cn(
                                 "rounded-full px-3 py-1 font-black text-[10px] uppercase",
                                 request.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                              )}>
                                 {request.status}
                              </Badge>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </div>
      )}
    </div>
  )
}
