"use client"

import React from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { expenseSchema, ExpenseFormValues } from "@/types/expense"
import { projectsData, ledgersData, ledgerGroupsData } from "@/lib/mock-data"
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
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Building2, Landmark, IndianRupee, CreditCard, MessageSquare, Save, AlertCircle } from "lucide-react"
import { usePermission } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormValues) => void
  onCancel?: () => void
  initialData?: ExpenseFormValues
}

export function ExpenseForm({ onSubmit, onCancel, initialData }: ExpenseFormProps) {
  const { isUser } = usePermission()
  const isReadOnly = isUser && !!initialData

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData || {
      date: new Date().toISOString().split('T')[0],
      projectId: "",
      ledgerId: "",
      costCentreId: "",
      amount: 0,
      paymentMode: "Cash",
      remark: "",
    },
  })

  const selectedProjectId = form.watch("projectId")

  // Filter for Expense Ledgers
  const expenseGroupIds = ledgerGroupsData
    .filter(g => g.nature === "Expense")
    .map(g => g.id)
  
  const expenseLedgers = ledgersData.filter(l => expenseGroupIds.includes(l.groupId))

  // Filter for Cost Centres mapping to the selected project
  const projectCostCentres = React.useMemo(() => {
    return projectsData.find(p => p.id === selectedProjectId)?.reportingMode === "Cost Centre" 
      ? ledgersData.filter(l => l.projectId === selectedProjectId) // Use Ledger mapping for now or specific master
      : []
  }, [selectedProjectId])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="date"
            render={({ field }: { field: ControllerRenderProps<ExpenseFormValues, "date"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2">
                  <Calendar className="h-4 w-4 text-primary" /> Expense Date
                </FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    readOnly={isUser || isReadOnly}
                    className={cn(
                      "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all",
                      (isUser || isReadOnly) && "opacity-60 cursor-not-allowed"
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
            render={({ field }: { field: ControllerRenderProps<ExpenseFormValues, "projectId"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2">
                  <Building2 className="h-4 w-4 text-primary" /> Branch / Project
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger 
                      disabled={isReadOnly}
                      className={cn(
                        "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all",
                        isReadOnly && "opacity-60"
                      )}
                    >
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                    {projectsData.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
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
            name="ledgerId"
            render={({ field }: { field: ControllerRenderProps<ExpenseFormValues, "ledgerId"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2">
                  <Landmark className="h-4 w-4 text-primary" /> Expense Ledger Head
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger 
                      disabled={isReadOnly}
                      className={cn(
                        "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all",
                        isReadOnly && "opacity-60"
                      )}
                    >
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                    {expenseLedgers.map(l => (
                      <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="costCentreId"
            render={({ field }: { field: ControllerRenderProps<ExpenseFormValues, "costCentreId"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Cost Centre (Optional)
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedProjectId}>
                  <FormControl>
                    <SelectTrigger 
                      disabled={isReadOnly || !selectedProjectId}
                      className={cn(
                        "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all",
                        (isReadOnly || !selectedProjectId) && "opacity-60"
                      )}
                    >
                      <SelectValue placeholder={selectedProjectId ? "Standard / Select CC" : "Select project first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                    <SelectItem value="">Universal (No Cost Centre)</SelectItem>
                    {/* In a real app we'd fetch actual Cost Centres. Mocking for UI sync. */}
                    <SelectItem value="cc1">Operation Control</SelectItem>
                    <SelectItem value="cc2">Site Maintenance</SelectItem>
                    <SelectItem value="cc3">Admin Support</SelectItem>
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
            name="amount"
            render={({ field }: { field: ControllerRenderProps<ExpenseFormValues, "amount"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2">
                  <IndianRupee className="h-4 w-4 text-primary" /> Amount (₹)
                </FormLabel>
                <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      readOnly={isReadOnly}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      className={cn(
                        "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-mono font-bold text-lg text-rose-600",
                        isReadOnly && "opacity-60 cursor-not-allowed"
                      )}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }: { field: ControllerRenderProps<ExpenseFormValues, "paymentMode"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2">
                  <CreditCard className="h-4 w-4 text-primary" /> Payment Mode
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger 
                      disabled={isReadOnly}
                      className={cn(
                        "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-bold",
                        isReadOnly && "opacity-60"
                      )}
                    >
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                    <SelectItem value="Cash">Cash Handover</SelectItem>
                    <SelectItem value="Bank Transfer">Bank / IMPS / NEFT</SelectItem>
                    <SelectItem value="UPI">UPI / QR Payment</SelectItem>
                    <SelectItem value="Cheque">Cheque Payment</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remark"
          render={({ field }: { field: ControllerRenderProps<ExpenseFormValues, "remark"> }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 font-bold mb-2">
                <MessageSquare className="h-4 w-4 text-primary" /> Remark
              </FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Enter details about this expense..." 
                  readOnly={isReadOnly}
                  className={cn(
                    "min-h-[100px] bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all",
                    isReadOnly && "opacity-60 cursor-not-allowed"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-4 pt-4">
          {isUser && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600/80">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-bold leading-tight uppercase">
                Entry once saved cannot be modified. Contact admin for changes.
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-8 rounded-xl border-border/40">
                Cancel
              </Button>
            )}
            {!isReadOnly && (
              <Button type="submit" className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                <Save className="h-5 w-5" />
                Post Expense
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
