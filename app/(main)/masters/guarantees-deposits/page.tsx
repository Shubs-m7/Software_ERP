"use client"

import React, { useState } from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  ShieldCheck, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  TrendingUp, 
  History, 
  User, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowDownCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function GuaranteesDepositsPage() {
  const { bankGuarantees, securityDeposits, user } = useAppStore()
  const [activeTab, setActiveTab] = useState("bg")

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <ShieldCheck className="h-3 w-3" />
             Strategic Safeguards
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Guarantees <span className="text-primary italic">& Deposits</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Manage bank guarantees, security deposits, and non-fund based limits.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           {useAppStore.getState().checkPermission?.('masters', 'all') && (
             <Button className="h-14 rounded-2xl bg-primary px-8 font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                <Plus className="h-5 w-5 mr-2" /> NEW {activeTab === "bg" ? "GUARANTEE" : "DEPOSIT"}
             </Button>
           )}
        </div>
      </div>

      <Tabs defaultValue="bg" onValueChange={setActiveTab} className="w-full">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <TabsList className="bg-muted/40 p-1.5 rounded-2xl h-16 w-fit border border-border/20 backdrop-blur-md">
               <TabsTrigger value="bg" className="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg font-black italic tracking-tight">
                  BANK GUARANTEES
               </TabsTrigger>
               <TabsTrigger value="sd" className="rounded-xl px-8 h-full data-[state=active]:bg-card data-[state=active]:text-primary data-[state=active]:shadow-lg font-black italic tracking-tight">
                  SECURITY DEPOSITS
               </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
               <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search records..." className="h-14 w-80 rounded-[1.2rem] bg-card border-border/40 pl-11 font-medium" />
               </div>
               <Button variant="outline" className="h-14 w-14 rounded-[1.2rem] border-border/40 bg-card">
                  <Filter className="h-5 w-5" />
               </Button>
            </div>
         </div>

         <TabsContent value="bg" className="mt-0">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
               <div className="xl:col-span-12">
                  <Card className="rounded-[2.5rem] border-border/40 bg-card/10 backdrop-blur-md shadow-xl overflow-hidden glass-card">
                     <CardContent className="p-0">
                        <Table>
                           <TableHeader className="bg-muted/30">
                              <TableRow className="border-border/40 hover:bg-transparent">
                                 <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest">Bank / BG Number</TableHead>
                                 <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Amount (₹)</TableHead>
                                 <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Validity Date</TableHead>
                                 <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                                 <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest">Administrative Trail</TableHead>
                              </TableRow>
                           </TableHeader>
                           <TableBody>
                              {bankGuarantees.length > 0 ? (
                                bankGuarantees.map((bg) => (
                                  <TableRow key={bg.id} className="border-border/40 hover:bg-muted/10">
                                     <TableCell className="py-6 px-8">
                                        <div className="flex flex-col gap-1">
                                           <span className="font-black text-base italic tracking-tight">{bg.bankName}</span>
                                           <code className="text-[10px] text-primary">{bg.bgNumber}</code>
                                        </div>
                                     </TableCell>
                                     <TableCell className="py-6 px-4 font-mono font-black text-lg">
                                        ₹{bg.amount.toLocaleString()}
                                     </TableCell>
                                     <TableCell className="py-6 px-4">
                                        <div className="flex items-center gap-2 text-xs font-bold">
                                           <Calendar className="h-3 w-3 text-muted-foreground" />
                                           {bg.expiryDate}
                                        </div>
                                     </TableCell>
                                     <TableCell className="py-6 px-4 text-center">
                                        <Badge className={cn(
                                          "bg-emerald-500/10 text-emerald-600 border-none px-4",
                                          bg.status === "Expired" && "bg-rose-500/10 text-rose-600",
                                          bg.status === "Invoked" && "bg-primary/10 text-primary"
                                        )}>
                                          {bg.status.toUpperCase()}
                                        </Badge>
                                     </TableCell>
                                     <TableCell className="py-6 px-8">
                                        <div className="flex flex-col gap-1.5 opacity-60">
                                           <div className="flex items-center gap-2 text-[10px] font-bold">
                                              <User className="h-3 w-3 text-primary" /> {bg.createdBy}
                                           </div>
                                           <div className="flex items-center gap-2 text-[10px] font-bold">
                                              <Clock className="h-3 w-3 text-primary" /> {bg.createdAt}
                                           </div>
                                        </div>
                                     </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                   <TableCell colSpan={5} className="py-32 text-center">
                                      <div className="flex flex-col items-center gap-4 opacity-30">
                                         <AlertTriangle className="h-12 w-12" />
                                         <p className="text-xl font-black italic">NO GUARANTEES ARCHIVED</p>
                                         <p className="text-sm font-medium">Add your first bank guarantee to start tracking limits.</p>
                                      </div>
                                   </TableCell>
                                </TableRow>
                              )}
                           </TableBody>
                        </Table>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </TabsContent>

         <TabsContent value="sd" className="mt-0">
            <Card className="rounded-[2.5rem] border-border/40 bg-card/10 backdrop-blur-md shadow-xl overflow-hidden glass-card">
               <CardContent className="p-0">
                  <Table>
                     <TableHeader className="bg-muted/30">
                        <TableRow className="border-border/40 hover:bg-transparent">
                           <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest">Particulars</TableHead>
                           <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Deposit Amount</TableHead>
                           <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest">Type</TableHead>
                           <TableHead className="py-6 px-4 font-black text-foreground uppercase text-[10px] tracking-widest text-center">Status</TableHead>
                           <TableHead className="py-6 px-8 font-black text-foreground uppercase text-[10px] tracking-widest">Audit Trail</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {securityDeposits.length > 0 ? (
                          securityDeposits.map((sd) => (
                            <TableRow key={sd.id} className="border-border/40 hover:bg-muted/10">
                               <TableCell className="py-6 px-8 font-black italic text-lg tracking-tight">{sd.particulars}</TableCell>
                               <TableCell className="py-6 px-4 font-mono font-black text-lg text-emerald-600">₹{sd.amount.toLocaleString()}</TableCell>
                               <TableCell className="py-6 px-4"><Badge variant="outline">{sd.type}</Badge></TableCell>
                               <TableCell className="py-6 px-4 text-center">
                                  <Badge className="bg-primary/10 text-primary border-none">{sd.status}</Badge>
                               </TableCell>
                               <TableCell className="py-6 px-8">
                                  <div className="flex flex-col gap-1.5 opacity-60">
                                     <div className="flex items-center gap-2 text-[10px] font-bold tracking-tighter">
                                        <User className="h-3 w-3 text-primary" /> {sd.createdBy}
                                     </div>
                                     <div className="flex items-center gap-2 text-[10px] font-bold tracking-tighter">
                                        <Clock className="h-3 w-3 text-primary" /> {sd.createdAt}
                                     </div>
                                  </div>
                               </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                             <TableCell colSpan={5} className="py-32 text-center">
                                <div className="flex flex-col items-center gap-4 opacity-30">
                                   <ArrowDownCircle className="h-12 w-12" />
                                   <p className="text-xl font-black italic">NO DEPOSITS LOGGED</p>
                                   <p className="text-sm font-medium">Record security deposits for rent, utilities, or contracts.</p>
                                </div>
                             </TableCell>
                          </TableRow>
                        )}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         </TabsContent>
      </Tabs>

    </div>
  )
}
