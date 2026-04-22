"use client"

import React, { useEffect, useMemo } from "react"
import { useForm, useFieldArray, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Save, Calendar, Building2, Calculator, IndianRupee } from "lucide-react"
import { registerBatchSchema, RegisterBatchValues } from "@/types/detailed-register"
import { projectsData } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { cn } from "@/lib/utils"

export default function DetailedRegisterPage() {
  const form = useForm<RegisterBatchValues>({
    resolver: zodResolver(registerBatchSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      projectId: "",
      rows: [
        { vehicleNo: "", ton: 0, rate: 0, total: 0, cash: 0, upi: 0, rNr: "R", addiAmount: 0, refund: 0 }
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rows",
  })

  // Watch for ton/rate changes to auto-calculate row totals
  const watchRows = form.watch("rows")

  const grandTotals = useMemo(() => {
    return watchRows.reduce((acc, row) => ({
      ton: acc.ton + (row.ton || 0),
      total: acc.total + ((row.ton || 0) * (row.rate || 0)),
      cash: acc.cash + (row.cash || 0),
      upi: acc.upi + (row.upi || 0),
    }), { ton: 0, total: 0, cash: 0, upi: 0 })
  }, [watchRows])

  const onSubmit = (data: RegisterBatchValues) => {
    console.log("Saving Register Batch:", data)
    alert(`Successfully saved ${data.rows.length} records!`)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" && index === fields.length - 1) {
      e.preventDefault()
      append({ vehicleNo: "", ton: 0, rate: 0, total: 0, cash: 0, upi: 0, rNr: "R", addiAmount: 0, refund: 0 })
    }
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tighter text-foreground decoration-primary decoration-4 underline-offset-8">
            Detailed Collection Register
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            Fast-entry spreadsheet for detailed vehicle logging.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-12 px-6 rounded-2xl border-border/40 bg-card/30 backdrop-blur-md hover:bg-muted/50 transition-all font-bold">
             Import CSV
           </Button>
           <Button 
             onClick={form.handleSubmit(onSubmit)}
             className="h-12 px-8 rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all font-black flex items-center gap-2"
           >
             <Save className="h-5 w-5" />
             POST REGISTER
           </Button>
        </div>
      </div>

      <Form {...form}>
        <form className="space-y-8">
          
          {/* Batch Header Context */}
          <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
               <div className="flex-1 w-full space-y-2">
                 <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
                   <Calendar className="h-3 w-3" /> Select Date
                 </label>
                 <FormField
                   control={form.control}
                   name="date"
                   render={({ field }: { field: ControllerRenderProps<RegisterBatchValues, "date"> }) => (
                     <Input type="date" {...field} className="h-14 bg-muted/10 border-border/40 focus:border-primary/50 text-lg font-bold rounded-2xl" />
                   )}
                 />
               </div>
               
               <div className="flex-1 w-full space-y-2">
                 <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
                   <Building2 className="h-3 w-3" /> Select Project / Site
                 </label>
                 <FormField
                    control={form.control}
                    name="projectId"
                    render={({ field }: { field: ControllerRenderProps<RegisterBatchValues, "projectId"> }) => (
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 bg-muted/10 border-border/40 text-lg font-bold rounded-2xl">
                            <SelectValue placeholder="Search site..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl">
                           {projectsData.filter(p => p.type === "BALU").map(p => (
                             <SelectItem key={p.id} value={p.id} className="h-12 font-bold">{p.name}</SelectItem>
                           ))}
                        </SelectContent>
                      </Select>
                    )}
                 />
               </div>
            </CardContent>
          </Card>

          {/* Spreadsheet Table */}
          <div className="rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-md shadow-3xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              <Table className="min-w-[1600px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-border/40 hover:bg-transparent h-20">
                    <TableHead className="w-16 px-6 text-center text-[9px] font-black uppercase tracking-widest">#</TableHead>
                    <TableHead className="w-40 px-4 text-[9px] font-black uppercase tracking-widest">LR / Slip No</TableHead>
                    <TableHead className="w-48 px-4 text-[9px] font-black uppercase tracking-widest">Vehicle No</TableHead>
                    <TableHead className="w-24 px-4 text-[9px] font-black uppercase tracking-widest text-center">Tyres</TableHead>
                    <TableHead className="w-24 px-4 text-[9px] font-black uppercase tracking-widest text-center">R/NR</TableHead>
                    <TableHead className="w-24 px-4 text-[9px] font-black uppercase tracking-widest text-center">Ton</TableHead>
                    <TableHead className="w-32 px-4 text-[9px] font-black uppercase tracking-widest text-center">Rate</TableHead>
                    <TableHead className="w-32 px-4 text-[9px] font-black uppercase tracking-widest text-center text-emerald-500">Addi Amt</TableHead>
                    <TableHead className="w-32 px-4 text-[9px] font-black uppercase tracking-widest text-center text-rose-500">Refund</TableHead>
                    <TableHead className="w-40 px-4 text-[9px] font-black uppercase tracking-widest text-center bg-primary/5">Total Amt</TableHead>
                    <TableHead className="w-32 px-4 text-[9px] font-black uppercase tracking-widest text-amber-500 text-center">Cash</TableHead>
                    <TableHead className="w-32 px-4 text-[9px] font-black uppercase tracking-widest text-blue-500 text-center">UPI</TableHead>
                    <TableHead className="w-48 px-4 text-[9px] font-black uppercase tracking-widest">Transporter / Remark</TableHead>
                    <TableHead className="w-16 px-6 text-center text-[9px] font-black uppercase tracking-widest">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => (
                    <TableRow 
                      key={field.id} 
                      className="group border-border/40 hover:bg-primary/5 transition-all h-20"
                    >
                      <TableCell className="text-center font-mono font-bold text-muted-foreground/60">{index + 1}</TableCell>
                      
                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.lrNo` as any}
                           render={({ field }) => (
                             <Input {...field} placeholder="LR-001" className="h-12 bg-transparent border-none text-sm font-bold focus-visible:ring-1 focus-visible:ring-primary/30" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.vehicleNo` as any}
                           render={({ field }) => (
                             <Input {...field} placeholder="MH 12 AB 1234" className="h-12 bg-transparent border-none text-sm font-bold uppercase focus-visible:ring-1 focus-visible:ring-primary/30" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.tyreNo` as any}
                           render={({ field }) => (
                             <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="h-12 bg-transparent border-none text-sm font-bold text-center focus-visible:ring-1 focus-visible:ring-primary/30" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.rNr` as any}
                           render={({ field }) => (
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                               <SelectTrigger className="h-12 bg-transparent border-none text-xs font-black shadow-none">
                                 <SelectValue />
                               </SelectTrigger>
                               <SelectContent className="rounded-xl">
                                 <SelectItem value="R">R</SelectItem>
                                 <SelectItem value="NR">NR</SelectItem>
                               </SelectContent>
                             </Select>
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.ton` as any}
                           render={({ field }) => (
                             <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-12 bg-transparent border-none text-sm font-mono font-bold text-center" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.rate` as any}
                           render={({ field }) => (
                             <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-12 bg-transparent border-none text-sm font-mono font-bold text-center" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.addiAmount` as any}
                           render={({ field }) => (
                             <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-12 bg-emerald-500/5 border-none text-sm font-mono font-bold text-center text-emerald-600" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.refund` as any}
                           render={({ field }) => (
                             <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-12 bg-rose-500/5 border-none text-sm font-mono font-bold text-center text-rose-600" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <div className="h-12 flex items-center justify-center px-3 font-mono font-black text-foreground bg-primary/10 rounded-xl border border-primary/20">
                           ₹{((watchRows[index]?.ton || 0) * (watchRows[index]?.rate || 0) + (watchRows[index]?.addiAmount || 0) - (watchRows[index]?.refund || 0)).toLocaleString()}
                         </div>
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.cash` as any}
                           render={({ field }) => (
                             <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-12 bg-amber-500/5 border-none text-sm font-mono font-bold text-center text-amber-600" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.upi` as any}
                           render={({ field }) => (
                             <Input type="number" {...field} onKeyDown={(e) => handleKeyDown(e, index)} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="h-12 bg-blue-500/5 border-none text-sm font-mono font-bold text-center text-blue-600" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="px-2">
                         <FormField
                           control={form.control}
                           name={`rows.${index}.remark` as any}
                           render={({ field }) => (
                             <Input {...field} placeholder="Remark..." className="h-12 bg-transparent border-none text-[10px] font-medium italic focus-visible:ring-1 focus-visible:ring-primary/30" />
                           )}
                         />
                      </TableCell>

                      <TableCell className="text-center px-6">
                        <Button type="button" variant="ghost" size="icon" onClick={() => fields.length > 1 && remove(index)} className="h-10 w-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-xl transition-all">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot className="bg-muted/50 border-t border-border/40 mt-8">
                  <TableRow className="h-24 hover:bg-transparent">
                    <TableCell colSpan={5} className="px-8 text-sm font-black uppercase tracking-widest text-primary italic">Consolidated Register Totals</TableCell>
                    <TableCell className="px-2 text-center font-mono font-black text-lg">{watchRows.reduce((sum, r) => sum + (r.ton || 0), 0).toFixed(2)}T</TableCell>
                    <TableCell className="px-2 text-center text-muted-foreground font-bold italic opacity-30">Avg Rate</TableCell>
                    <TableCell className="px-2 text-center font-mono font-black text-emerald-600">₹{watchRows.reduce((sum, r) => sum + (r.addiAmount || 0), 0).toLocaleString()}</TableCell>
                    <TableCell className="px-2 text-center font-mono font-black text-rose-600">₹{watchRows.reduce((sum, r) => sum + (r.refund || 0), 0).toLocaleString()}</TableCell>
                    <TableCell className="px-2">
                      <div className="flex flex-col items-center">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Net Amt</span>
                         <span className="font-mono font-black text-xl text-primary">₹{watchRows.reduce((sum, r) => sum + (r.ton * r.rate + r.addiAmount - r.refund), 0).toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 text-center font-mono font-black text-xl text-amber-600">₹{watchRows.reduce((sum, r) => sum + (r.cash || 0), 0).toLocaleString()}</TableCell>
                    <TableCell className="px-2 text-center font-mono font-black text-xl text-blue-600">₹{watchRows.reduce((sum, r) => sum + (r.upi || 0), 0).toLocaleString()}</TableCell>
                    <TableCell colSpan={2} />
                  </TableRow>
                </tfoot>
              </Table>
            </div>
            
            <div className="p-8 border-t border-border/40 bg-card/20 flex justify-center">
               <Button 
                 type="button" 
                 variant="ghost"
                 onClick={() => append({ lrNo: "", vehicleNo: "", tyreNo: 10, rNr: "R" as const, ton: 0, rate: 0, addiAmount: 0, total: 0, cash: 0, upi: 0, refund: 0, remark: "" })}
                 className="h-14 px-10 rounded-2xl border-2 border-dashed border-primary/20 text-primary font-black hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-3"
               >
                 <Plus className="h-6 w-6" />
                 ADD NEW ENTRY ROW
               </Button>
            </div>
          </div>

          <QuickStats watchRows={watchRows} />
        </form>
      </Form>
    </div>
  )
}

function QuickStats({ watchRows }: { watchRows: any[] }) {
  const totals = useMemo(() => {
    return watchRows.reduce((acc, r) => ({
      ton: acc.ton + (r.ton || 0),
      cash: acc.cash + (r.cash || 0),
      upi: acc.upi + (r.upi || 0),
      total: acc.total + (r.ton * r.rate + r.addiAmount - r.refund)
    }), { ton: 0, cash: 0, upi: 0, total: 0 })
  }, [watchRows])

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      {[
        { label: "Total Load", value: `${totals.ton.toFixed(1)} MT`, icon: <Activity className="h-5 w-5 text-emerald-500" />, color: "emerald" },
        { label: "Cash Share", value: `₹${totals.cash.toLocaleString()}`, icon: <IndianRupee className="h-5 w-5 text-amber-500" />, color: "amber" },
        { label: "UPI Share", value: `₹${totals.upi.toLocaleString()}`, icon: <Smartphone className="h-5 w-5 text-blue-500" />, color: "blue" },
        { label: "Net Earnings", value: `₹${totals.total.toLocaleString()}`, icon: <Landmark className="h-5 w-5 text-purple-500" />, color: "purple" },
      ].map((stat) => (
        <Card key={stat.label} className="rounded-[2rem] border-border/40 bg-card/10 backdrop-blur-md shadow-xl">
          <CardContent className="p-6 flex items-center gap-4">
             <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-card/50", `text-${stat.color}-500 shadow-inner`)}>
               {stat.icon}
             </div>
             <div>
                <p className="text-[10px] font-black underline decoration-primary/30 text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black font-mono tracking-tighter">{stat.value}</p>
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Smartphone({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
      <path d="M12 18h.01"/>
    </svg>
  )
}

function Activity({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  )
}

function Landmark({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="3" x2="21" y1="22" y2="22"/>
      <line x1="6" x2="6" y1="18" y2="11"/>
      <line x1="10" x2="10" y1="18" y2="11"/>
      <line x1="14" x2="14" y1="18" y2="11"/>
      <line x1="18" x2="18" y1="18" y2="11"/>
      <polygon points="12 2 20 7 4 7"/>
    </svg>
  )
}
