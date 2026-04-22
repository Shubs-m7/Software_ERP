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
import { vehicleTypeSchema, VehicleTypeFormValues, VehicleType } from "@/types/vehicle-type"

interface VehicleTypeFormProps {
  initialData?: VehicleType | null
  onSubmit: (data: VehicleTypeFormValues) => void
  onCancel: () => void
}

export function VehicleTypeForm({ initialData, onSubmit, onCancel }: VehicleTypeFormProps) {
  const form = useForm<VehicleTypeFormValues>({
    resolver: zodResolver(vehicleTypeSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      capacity: "",
      status: "Active",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight">
            {initialData ? "Edit Vehicle Type" : "Create Vehicle Type"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Classify vehicle categories and capacities.
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Classification Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 10 Wheeler, LCV" className="h-12 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Load Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 15 Tons" className="h-12 rounded-xl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Brief Description</FormLabel>
                <FormControl>
                  <Input placeholder="Operational notes..." className="h-12 rounded-xl" {...field} />
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

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onCancel} className="rounded-xl h-11 px-6">
            Cancel
          </Button>
          <Button type="submit" className="rounded-xl h-11 px-8 bg-primary hover:bg-primary/90">
            {initialData ? "Update Classification" : "Save Classification"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
