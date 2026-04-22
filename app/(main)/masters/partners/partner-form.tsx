"use client"

import React from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Partner, partnerSchema, PartnerFormValues } from "@/types/partner"
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

interface PartnerFormProps {
  initialData?: Partner | null
  onSubmit: (data: PartnerFormValues) => void
  onCancel: () => void
}

export function PartnerForm({
  initialData,
  onSubmit,
  onCancel,
}: PartnerFormProps) {
  const form = useForm<PartnerFormValues>({
    resolver: zodResolver(partnerSchema),
    defaultValues: initialData || {
      name: "",
      mobile: "",
      email: "",
      shareRatio: 0,
      openingCapital: 0,
      status: "Active",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Partner" : "Create New Partner"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<PartnerFormValues, any> }) => (
              <FormItem>
                <FormLabel>Partner Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter partner name" {...field} className="bg-muted/10 border-border/40 focus:border-primary/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }: { field: ControllerRenderProps<PartnerFormValues, "mobile"> }) => (
                <FormItem>
                  <FormLabel>Mobile No</FormLabel>
                  <FormControl>
                    <Input placeholder="9876543210" {...field} className="bg-muted/10 border-border/40" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }: { field: ControllerRenderProps<PartnerFormValues, "status"> }) => (
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: ControllerRenderProps<PartnerFormValues, "email"> }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="example@partner.com" {...field} className="bg-muted/10 border-border/40" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="shareRatio"
              render={({ field }: { field: ControllerRenderProps<PartnerFormValues, any> }) => (
                <FormItem>
                  <FormLabel>Share Ratio (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="33.33" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="bg-muted/10 border-border/40 font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="openingCapital"
              render={({ field }: { field: ControllerRenderProps<PartnerFormValues, any> }) => (
                <FormItem>
                  <FormLabel>Opening Capital</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="100000" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} className="bg-muted/10 border-border/40 font-mono" />
                  </FormControl>
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
            {initialData ? "Save Changes" : "Create Partner"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
