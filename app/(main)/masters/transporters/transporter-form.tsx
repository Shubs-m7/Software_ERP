"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import { Button } from "@/components/ui/button"
import { transporterSchema, TransporterFormValues, Transporter } from "@/types/transporter"

interface TransporterFormProps {
  initialData?: Transporter | null
  onSubmit: (data: TransporterFormValues) => void
  onCancel: () => void
}

export function TransporterForm({ initialData, onSubmit, onCancel }: TransporterFormProps) {
  const form = useForm<TransporterFormValues>({
    resolver: zodResolver(transporterSchema),
    defaultValues: initialData || {
      name: "",
      code: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      status: "Active",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">
            {initialData ? "Edit Transporter" : "Create New Transporter"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the details for the transport provider.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Transporter Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" className="h-12 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Provider Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. TR-001" className="h-12 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactPerson"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" className="h-12 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="10-digit number" className="h-12 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" className="h-12 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl">
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
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Business Address</FormLabel>
              <FormControl>
                <Input placeholder="Full address" className="h-12 rounded-xl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onCancel} className="rounded-xl h-11 px-6">
            Cancel
          </Button>
          <Button type="submit" className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90">
            {initialData ? "Update Transporter" : "Create Transporter"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
