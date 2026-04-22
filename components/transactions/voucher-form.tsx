"use client"

import React, { useEffect, useMemo } from "react"
import { useForm, useFieldArray, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Save, Calendar, Building2, Calculator, IndianRupee, AlertCircle } from "lucide-react"
import { voucherSchema, VoucherFormValues, VoucherType } from "@/types/voucher"
import { projectsData, ledgersData } from "@/lib/mock-data"
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

interface VoucherFormProps {
  type: VoucherType
  onSubmit: (data: VoucherFormValues) => void
}

export function VoucherForm({ type, onSubmit }: VoucherFormProps) {
  const form = useForm<VoucherFormValues>({
    resolver: zodResolver(voucherSchema),
    defaultValues: {
      voucherNo: `${type.slice(0, 3)}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      date: new Date().toISOString().split('T')[0],
      type: type,
      projectId: "",
      narration: "",
      lines: [
        { ledgerId: "", drAmount: 0, crAmount: 0, remark: "" },
        { ledgerId: "", drAmount: 0, crAmount: 0, remark: "" }
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lines",
  })

  const watchLines = form.watch("lines")

  const totals = useMemo(() => {
    return watchLines.reduce((acc, line) => ({
      dr: acc.dr + (Number(line.drAmount) || 0),
      cr: acc.cr + (Number(line.crAmount) || 0)
    }), { dr: 0, cr: 0 })
  }, [watchLines])

  const balance = totals.dr - totals.cr
  const isBalanced = totals.dr > 0 && totals.cr > 0 && Math.abs(balance) < 0.01

  // For Receipt/Payment, we might want to filter ledgers for the settlement side
  // but for now we show all active ledgers
  const filteredLedgers = ledgersData.filter(l => l.status === "Active")

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Voucher Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
               <Calendar className="h-3 w-3" /> Date
             </label>
             <FormField
               control={form.control}
               name="date"
               render={({ field }) => (
                 <Input type="date" {...field} className="h-12 bg-muted/10 border-border/40 font-bold rounded-xl" />
               )}
             />
           </div>

           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
               <Calculator className="h-3 w-3" /> Voucher No
             </label>
             <FormField
               control={form.control}
               name="voucherNo"
               render={({ field }) => (
                 <Input {...field} readOnly className="h-12 bg-muted/20 border-border/40 font-mono font-bold rounded-xl opacity-70 cursor-not-allowed" />
               )}
             />
           </div>

           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
               <Building2 className="h-3 w-3" /> Project / Site
             </label>
             <FormField
               control={form.control}
               name="projectId"
               render={({ field }) => (
                 <Select onValueChange={field.onChange} defaultValue={field.value}>
                   <FormControl>
                     <SelectTrigger className="h-12 bg-muted/10 border-border/40 font-bold rounded-xl w-full">
                       <SelectValue placeholder="Select site..." />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                      {projectsData.map(p => (
                        <SelectItem key={p.id} value={p.id} className="h-10 font-bold">{p.name}</SelectItem>
                      ))}
                   </SelectContent>
                 </Select>
               )}
             />
           </div>
        </div>

        {/* Ledger Entries Table */}
        <div className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-md shadow-xl overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30 h-16">
              <TableRow className="border-border/40 hover:bg-transparent">
                <TableHead className="px-6 text-[10px] font-black uppercase tracking-widest">Particulars (Ledger Name)</TableHead>
                <TableHead className="w-32 px-4 text-right text-[10px] font-black uppercase tracking-widest">Debit (₹)</TableHead>
                <TableHead className="w-32 px-4 text-right text-[10px] font-black uppercase tracking-widest">Credit (₹)</TableHead>
                <TableHead className="w-16 px-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id} className="border-border/40 hover:bg-primary/5 transition-colors h-16">
                  <TableCell className="px-4">
                     <FormField
                       control={form.control}
                       name={`lines.${index}.ledgerId`}
                       render={({ field }) => (
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                             <SelectTrigger className="h-10 border-none bg-transparent hover:bg-muted/50 transition-colors font-bold w-full">
                               <SelectValue placeholder="Search ledger..." />
                             </SelectTrigger>
                           </FormControl>
                           <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                              {filteredLedgers.map(l => (
                                <SelectItem key={l.id} value={l.id} className="h-10 font-bold">
                                  {l.name} <span className="ml-2 text-[9px] opacity-40 font-medium">({l.nature})</span>
                                </SelectItem>
                              ))}
                           </SelectContent>
                         </Select>
                       )}
                     />
                  </TableCell>
                  <TableCell className="px-2">
                     <FormField
                       control={form.control}
                       name={`lines.${index}.drAmount`}
                       render={({ field }) => (
                         <Input 
                           type="number"
                           {...field}
                           onChange={e => {
                             field.onChange(Number(e.target.value))
                             if (Number(e.target.value) > 0) {
                               form.setValue(`lines.${index}.crAmount`, 0)
                             }
                           }}
                           className="h-10 bg-transparent border-none text-right font-mono font-bold text-blue-600 focus-visible:ring-0" 
                         />
                       )}
                     />
                  </TableCell>
                  <TableCell className="px-2">
                     <FormField
                       control={form.control}
                       name={`lines.${index}.crAmount`}
                       render={({ field }) => (
                         <Input 
                           type="number"
                           {...field}
                           onChange={e => {
                             field.onChange(Number(e.target.value))
                             if (Number(e.target.value) > 0) {
                               form.setValue(`lines.${index}.drAmount`, 0)
                             }
                           }}
                           className="h-10 bg-transparent border-none text-right font-mono font-bold text-rose-600 focus-visible:ring-0" 
                         />
                       )}
                     />
                  </TableCell>
                  <TableCell className="px-6 text-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => fields.length > 2 && remove(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <tfoot className="bg-muted/20 border-t border-border/40">
               <TableRow className="h-16 hover:bg-transparent">
                  <TableCell className="px-8 flex items-center justify-between">
                     <Button 
                       type="button" 
                       variant="ghost" 
                       size="sm"
                       onClick={() => append({ ledgerId: "", drAmount: 0, crAmount: 0, remark: "" })}
                       className="text-[10px] font-black uppercase text-primary gap-2"
                     >
                       <Plus className="h-3 w-3" /> Add Row
                     </Button>
                     <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pr-4">Total</span>
                  </TableCell>
                  <TableCell className="text-right px-4 font-mono font-black text-blue-600 text-lg">
                    ₹{totals.dr.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right px-4 font-mono font-black text-rose-600 text-lg">
                    ₹{totals.cr.toLocaleString()}
                  </TableCell>
                  <TableCell />
               </TableRow>
            </tfoot>
          </Table>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex-1 w-full flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/20">
              <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                isBalanced ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                 {isBalanced ? <IndianRupee className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">Voucher Balance</p>
                 <p className={cn("text-sm font-black mt-1", isBalanced ? "text-emerald-500" : "text-amber-500")}>
                    {isBalanced ? "Balanced Entry" : `Unbalanced: ₹${Math.abs(balance).toLocaleString()} Difference`}
                 </p>
              </div>
           </div>

           <div className="w-full md:w-auto flex flex-col gap-4">
              <FormField
                control={form.control}
                name="narration"
                render={({ field }) => (
                  <Input 
                    {...field} 
                    placeholder="Enter narration here..." 
                    className="h-14 w-80 bg-background/50 border-border/40 italic font-medium px-6 rounded-2xl"
                  />
                )}
              />
              <Button 
                type="submit" 
                disabled={!isBalanced || form.formState.isSubmitting}
                className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-3"
              >
                <Save className="h-5 w-5" />
                POST {type} VOUCHER
              </Button>
           </div>
        </div>

      </form>
    </Form>
  )
}
