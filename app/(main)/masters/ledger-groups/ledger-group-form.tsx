"use client"

import React from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LedgerGroup, ledgerGroupSchema, LedgerGroupFormValues } from "@/types/ledger-group"
import { ledgerGroupsData } from "@/lib/mock-data"
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

interface LedgerGroupFormProps {
  initialData?: LedgerGroup | null
  onSubmit: (data: LedgerGroupFormValues) => void
  onCancel: () => void
}

export function LedgerGroupForm({
  initialData,
  onSubmit,
  onCancel,
}: LedgerGroupFormProps) {
  const form = useForm<LedgerGroupFormValues>({
    resolver: zodResolver(ledgerGroupSchema),
    defaultValues: initialData || {
      name: "",
      nature: "Asset",
      parentGroup: "",
      status: "Active",
      reportCategory: "Asset",
      isDirect: false,
      displayOrder: 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Ledger Group" : "Create New Ledger Group"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<LedgerGroupFormValues, any> }) => (
              <FormItem>
                <FormLabel>Group Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Current Assets" {...field} className="bg-muted/10 border-border/40 focus:border-primary/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="nature"
            render={({ field }: { field: ControllerRenderProps<LedgerGroupFormValues, any> }) => (
              <FormItem>
                <FormLabel>Nature of Group</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-muted/10 border-border/40">
                      <SelectValue placeholder="Select nature" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Asset">Asset</SelectItem>
                    <SelectItem value="Liability">Liability</SelectItem>
                    <SelectItem value="Income">Income</SelectItem>
                    <SelectItem value="Expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="parentGroup"
            render={({ field }: { field: ControllerRenderProps<LedgerGroupFormValues, any> }) => (
              <FormItem>
                <FormLabel>Under Group (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-muted/10 border-border/40">
                      <SelectValue placeholder="Primary Group" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Primary Group</SelectItem>
                    {ledgerGroupsData.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="reportCategory"
              render={({ field }: { field: ControllerRenderProps<LedgerGroupFormValues, any> }) => (
                <FormItem>
                  <FormLabel>Report Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/10 border-border/40">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Direct Income">Direct Income</SelectItem>
                      <SelectItem value="Indirect Income">Indirect Income</SelectItem>
                      <SelectItem value="Direct Expense">Direct Expense</SelectItem>
                      <SelectItem value="Indirect Expense">Indirect Expense</SelectItem>
                      <SelectItem value="Asset">Asset</SelectItem>
                      <SelectItem value="Liability">Liability</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDirect"
              render={({ field }: { field: ControllerRenderProps<LedgerGroupFormValues, any> }) => (
                <FormItem>
                  <FormLabel>Direct/Indirect</FormLabel>
                  <Select onValueChange={(val) => field.onChange(val === "Direct")} value={field.value ? "Direct" : "Indirect"}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/10 border-border/40">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Direct">Direct</SelectItem>
                      <SelectItem value="Indirect">Indirect</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="displayOrder"
              render={({ field }: { field: ControllerRenderProps<LedgerGroupFormValues, any> }) => (
                <FormItem>
                  <FormLabel>Display Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value) || 0)} className="bg-muted/10 border-border/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }: { field: ControllerRenderProps<LedgerGroupFormValues, "status"> }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/10 border-border/40">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} className="border-border/40">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            {initialData ? "Save Changes" : "Create Group"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
