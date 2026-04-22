"use client"

import React, { useMemo } from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Ledger, ledgerSchema, LedgerFormValues } from "@/types/ledger"
import { ledgerGroupsData, projectsData } from "@/lib/mock-data"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, Trash2, Info } from "lucide-react"

interface LedgerFormProps {
  initialData?: Ledger | null
  onSubmit: (data: LedgerFormValues) => void
  onCancel: () => void
}

export function LedgerForm({
  initialData,
  onSubmit,
  onCancel,
}: LedgerFormProps) {
  const form = useForm<LedgerFormValues>({
    resolver: zodResolver(ledgerSchema),
    defaultValues: initialData || {
      name: "",
      nature: "Asset",
      groupId: "",
      openingBalance: 0,
      balanceType: "Dr",
      status: "Active",
    },
  })

  // Tally-style Logic: Watch Nature and filter groups
  const nature = form.watch("nature")

  const filteredGroups = useMemo(() => {
    return ledgerGroupsData.filter(g => g.nature === nature)
  }, [nature])

  // Auto-set Balance Type (Dr/Cr) based on Nature
  React.useEffect(() => {
    if (!initialData) {
      if (nature === "Expense" || nature === "Asset") {
        form.setValue("balanceType", "Dr")
      } else {
        form.setValue("balanceType", "Cr")
      }
    }
  }, [nature, form, initialData])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
        <DialogHeader className="space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <CreditCard className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black tracking-tight tracking-tighter">
               {initialData ? "Modify Ledger Head" : "Create New Ledger Head"}
            </DialogTitle>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tally-Style Configuration</p>
          </div>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<LedgerFormValues, "name"> }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Ledger Head Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Parking Charges" {...field} className="h-14 bg-muted/10 border-border/40 rounded-2xl focus:bg-background transition-all font-bold text-lg" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nature"
              render={({ field }: { field: ControllerRenderProps<LedgerFormValues, "nature"> }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Nature (Category)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-muted/10 border-border/40 rounded-xl font-bold">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                      <SelectItem value="Asset" className="font-bold">Asset</SelectItem>
                      <SelectItem value="Liability" className="font-bold">Liability</SelectItem>
                      <SelectItem value="Income" className="font-bold text-emerald-600 focus:text-emerald-600">Income</SelectItem>
                      <SelectItem value="Expense" className="font-bold text-rose-600 focus:text-rose-600">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="groupId"
              render={({ field }: { field: ControllerRenderProps<LedgerFormValues, "groupId"> }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Parent Group (Under)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-muted/10 border-border/40 rounded-xl font-bold">
                        <SelectValue placeholder="Select group" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                      {filteredGroups.map(group => (
                        <SelectItem key={group.id} value={group.id} className="font-bold">
                          {group.name}
                        </SelectItem>
                      ))}
                      {filteredGroups.length === 0 && (
                        <p className="p-4 text-[10px] text-center font-black uppercase text-rose-500">No groups for this nature</p>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="openingBalance"
              render={({ field }: { field: ControllerRenderProps<LedgerFormValues, "openingBalance"> }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Opening Balance</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      className="h-12 bg-muted/10 border-border/40 rounded-xl font-mono font-bold" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balanceType"
              render={({ field }: { field: ControllerRenderProps<LedgerFormValues, "balanceType"> }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Dr/Cr Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-muted/10 border-border/40 rounded-xl font-bold">
                        <SelectValue placeholder="Dr/Cr" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                      <SelectItem value="Dr" className="font-bold text-emerald-600">Dr (Debit)</SelectItem>
                      <SelectItem value="Cr" className="font-bold text-rose-600">Cr (Credit)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }: { field: ControllerRenderProps<LedgerFormValues, "type"> }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Ledger Classification</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-muted/10 border-border/40 rounded-xl font-bold">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                      <SelectItem value="General" className="font-bold">General Ledger</SelectItem>
                      <SelectItem value="Cash" className="font-bold">Cash Account</SelectItem>
                      <SelectItem value="Bank" className="font-bold">Bank Account</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectId"
              render={({ field }: { field: ControllerRenderProps<LedgerFormValues, "projectId"> }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Project/Site Mapping (Optional)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 bg-muted/10 border-border/40 rounded-xl font-bold">
                        <SelectValue placeholder="Select site" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                      <SelectItem value="">Universal / Common</SelectItem>
                      {projectsData.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="p-4 rounded-[1.5rem] bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
             <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
             <p className="text-[10px] font-bold text-amber-700 leading-tight uppercase tracking-tight">
               Classification as 'Cash' or 'Bank' will enable this ledger for entry in Contra and Payment/Receipt vouchers.
             </p>
          </div>
        </div>

        <DialogFooter className="gap-3 pt-6">
          <Button type="button" variant="ghost" onClick={onCancel} className="h-14 px-8 rounded-2xl font-bold">
            Discard
          </Button>
          <Button type="submit" className="h-14 px-10 rounded-2xl bg-primary text-primary-foreground font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            {initialData ? "Update Ledger Head" : "Onboard Ledger Head"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
