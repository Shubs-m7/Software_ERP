"use client"

import React from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CostCentre, costCentreSchema, CostCentreFormValues } from "@/types/cost-centre"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CostCentreFormProps {
  initialData?: CostCentre | null
  onSubmit: (data: CostCentreFormValues) => void
  onCancel: () => void
}

export function CostCentreForm({
  initialData,
  onSubmit,
  onCancel,
}: CostCentreFormProps) {
  const form = useForm<CostCentreFormValues>({
    resolver: zodResolver(costCentreSchema),
    defaultValues: initialData || {
      name: "",
      category: "Internal",
      manager: "",
      status: "Active",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Cost Centre" : "Create New Cost Centre"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<CostCentreFormValues, any> }) => (
              <FormItem>
                <FormLabel>Centre Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Marketing Dept" {...field} className="bg-muted/10 border-border/40 focus:border-primary/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }: { field: ControllerRenderProps<CostCentreFormValues, any> }) => (
              <FormItem>
                <FormLabel>Cost Centre Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. MKT-001" {...field} className="bg-muted/10 border-border/40 font-mono focus:border-primary/50" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="projectId"
            render={({ field }: { field: ControllerRenderProps<CostCentreFormValues, any> }) => (
              <FormItem>
                <FormLabel>Assigned Project/Site</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-muted/10 border-border/40">
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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

          <FormField
            control={form.control}
            name="status"
            render={({ field }: { field: ControllerRenderProps<CostCentreFormValues, any> }) => (
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

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} className="border-border/40">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
            {initialData ? "Save Changes" : "Create Centre"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
