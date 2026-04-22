"use client"

import React, { useState, useMemo } from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Truck, Calendar, Building2, UserCircle, Weight, IndianRupee, Save, ListChecks, History } from "lucide-react"
import { baluDispatchSchema, BaluDispatchFormValues, BaluDispatchEntry } from "@/types/balu-dispatch"
import { projectsData } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { usePermission } from "@/hooks/use-permission"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export default function BaluDispatchPage() {
  const { isUser } = usePermission()
  const [sessionEntries, setSessionEntries] = useState<BaluDispatchEntry[]>([])
  
  const form = useForm<BaluDispatchFormValues>({
    resolver: zodResolver(baluDispatchSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      projectId: "",
      vehicleNo: "",
      transporter: "",
      tonnage: 0,
      rate: 0,
    },
  })

  const { tonnage, rate, projectId } = form.watch()
  const totalAmount = useMemo(() => (tonnage || 0) * (rate || 0), [tonnage, rate])

  const onSubmit = (data: BaluDispatchFormValues) => {
    const newEntry: BaluDispatchEntry = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      totalAmount: (data.tonnage || 0) * (data.rate || 0),
    }
    setSessionEntries(prev => [newEntry, ...prev])
    form.reset({
      ...data, // Keep date and project for next entry
      vehicleNo: "",
      transporter: "",
      tonnage: 0,
      rate: 0,
    })
    alert("Dispatch entry recorded successfully!")
  }

  const baluProjects = projectsData.filter(p => p.type === "BALU")
  const selectedProject = baluProjects.find(p => p.id === projectId)

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black tracking-tight text-foreground uppercase italic border-l-4 border-amber-500 pl-4">
          Balu Dispatch Entry
        </h1>
        <p className="text-muted-foreground font-medium ml-5">
          Record outbound dispatches and calculate billable amounts for construction sites.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
        
        {/* Entry Form Card */}
        <Card className="xl:col-span-8 rounded-[2rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }: { field: ControllerRenderProps<BaluDispatchFormValues, "date"> }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-bold mb-2">
                          <Calendar className="h-4 w-4 text-amber-500" /> Date of Dispatch
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            readOnly={isUser}
                            className={cn(
                              "h-14 bg-muted/10 border-border/40 text-lg font-bold rounded-2xl transition-all focus:bg-background",
                              isUser && "opacity-60 cursor-not-allowed"
                            )} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }: { field: ControllerRenderProps<BaluDispatchFormValues, "projectId"> }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-bold mb-2">
                          <Building2 className="h-4 w-4 text-amber-500" /> Balu Project
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-14 bg-muted/10 border-border/40 text-lg font-bold rounded-2xl focus:bg-background transition-all">
                              <SelectValue placeholder="Select site" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl">
                            {baluProjects.map(p => (
                              <SelectItem key={p.id} value={p.id} className="h-12 font-bold">{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="vehicleNo"
                    render={({ field }: { field: ControllerRenderProps<BaluDispatchFormValues, "vehicleNo"> }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-bold mb-2">
                          <Truck className="h-4 w-4 text-amber-500" /> Vehicle Number
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="GJ 01 AB 1234" {...field} className="h-14 bg-muted/10 border-border/40 text-lg font-bold uppercase rounded-2xl transition-all focus:bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="transporter"
                    render={({ field }: { field: ControllerRenderProps<BaluDispatchFormValues, "transporter"> }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-bold mb-2">
                          <UserCircle className="h-4 w-4 text-amber-500" /> Transporter Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter transporter/firm" {...field} className="h-14 bg-muted/10 border-border/40 text-lg font-bold rounded-2xl transition-all focus:bg-background" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/10">
                  <FormField
                    control={form.control}
                    name="tonnage"
                    render={({ field }: { field: ControllerRenderProps<BaluDispatchFormValues, "tonnage"> }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-bold mb-2">
                          <Weight className="h-4 w-4 text-amber-500" /> Weight (Tons)
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-14 bg-background/50 border-border/40 text-xl font-mono font-bold rounded-2xl text-center" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }: { field: ControllerRenderProps<BaluDispatchFormValues, "rate"> }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-bold mb-2">
                          <IndianRupee className="h-4 w-4 text-amber-500" /> Rate / Ton
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            {...field} 
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            className="h-14 bg-background/50 border-border/40 text-xl font-mono font-bold rounded-2xl text-center" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-col justify-center items-center gap-1">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Calculated Total</span>
                    <div className="text-3xl font-black text-foreground font-mono">
                      ₹{totalAmount.toLocaleString()}
                    </div>
                  </div>
                </div>

                {isUser && (
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600/80">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="text-xs font-bold leading-tight uppercase">
                      Entry once saved cannot be modified. Contact admin for changes.
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-16 rounded-[2rem] bg-amber-600 text-white text-xl font-black shadow-2xl shadow-amber-500/30 hover:scale-[1.01] active:scale-95 transition-all flex items-center gap-3"
                >
                  <Save className="h-6 w-6" />
                  POST DISPATCH ENTRY
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right Info Section */}
        <div className="xl:col-span-4 space-y-8">
           <Card className="rounded-[2rem] border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent backdrop-blur-md shadow-xl overflow-hidden">
             <CardContent className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black uppercase tracking-widest text-amber-600">Active Selection</h3>
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-card/40 border border-border/40">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Target Project</p>
                    <p className="text-lg font-black truncate">{selectedProject?.name || "None Targeted"}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-card/40 border border-border/40">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Loaded</p>
                      <p className="text-lg font-black">{sessionEntries.reduce((acc, e) => acc + e.tonnage, 0).toFixed(2)} T</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-card/40 border border-border/40">
                      <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Worth</p>
                      <p className="text-lg font-black">₹{sessionEntries.reduce((acc, e) => acc + e.totalAmount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
             </CardContent>
           </Card>

           <div className="p-8 rounded-[2rem] border border-dashed border-border/60 flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-2xl bg-muted/20 flex items-center justify-center">
                 <ListChecks className="text-muted-foreground h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-muted-foreground leading-relaxed">
                Ensure the vehicle number matches the Weighted Slip before entry.
              </p>
           </div>
        </div>

        {/* Preview Table Section */}
        <div className="xl:col-span-12 space-y-6 mb-12 animate-in slide-in-from-bottom-10 duration-1000">
           <div className="flex items-center gap-3 px-2">
             <History className="h-6 w-6 text-amber-500" />
             <h2 className="text-xl font-black uppercase tracking-tighter">Session Entries Preview</h2>
             <span className="ml-auto text-xs font-bold text-muted-foreground uppercase flex items-center gap-2">
               Showing last {sessionEntries.length} dispatches
             </span>
           </div>
           
           <div className="rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-md shadow-3xl overflow-hidden">
             <Table>
               <TableHeader className="bg-muted/30 h-16">
                 <TableRow className="border-border/40">
                   <TableHead className="px-8 font-black uppercase tracking-widest text-[10px]">Time/Date</TableHead>
                   <TableHead className="font-black uppercase tracking-widest text-[10px]">Vehicle No</TableHead>
                   <TableHead className="font-black uppercase tracking-widest text-[10px]">Transporter</TableHead>
                   <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Tonnage</TableHead>
                   <TableHead className="font-black uppercase tracking-widest text-[10px] text-center">Rate</TableHead>
                   <TableHead className="px-8 text-right font-black uppercase tracking-widest text-[10px]">Total Amount</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {sessionEntries.length > 0 ? (
                   sessionEntries.map((entry) => (
                     <TableRow key={entry.id} className="border-border/40 hover:bg-muted/10 transition-colors h-16 group">
                        <TableCell className="px-8 font-mono text-xs">{entry.date}</TableCell>
                        <TableCell className="font-bold text-foreground">{entry.vehicleNo}</TableCell>
                        <TableCell className="text-muted-foreground font-medium">{entry.transporter}</TableCell>
                        <TableCell className="text-center">
                           <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black">
                             {entry.tonnage} T
                           </span>
                        </TableCell>
                        <TableCell className="text-center font-mono font-bold opacity-60">₹{entry.rate}</TableCell>
                        <TableCell className="px-8 text-right font-black font-mono text-amber-600 text-lg">
                          ₹{entry.totalAmount.toLocaleString()}
                        </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-2 opacity-30">
                           <History className="h-12 w-12" />
                           <p className="font-bold uppercase tracking-widest text-xs">No entries recorded in this session</p>
                        </div>
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </div>
        </div>

      </div>
    </div>
  )
}
