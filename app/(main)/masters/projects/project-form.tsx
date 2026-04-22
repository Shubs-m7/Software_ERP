"use client"

import React from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Project, projectSchema, ProjectFormValues } from "@/types/project"
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

interface ProjectFormProps {
  initialData?: Project | null
  onSubmit: (data: ProjectFormValues) => void
  onCancel: () => void
}

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      name: "",
      type: "PARKING",
      startDate: new Date().toISOString().split('T')[0],
      status: "Active",
      reportingMode: "Non-Cost Centre",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project/Site" : "Create New Project/Site"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<ProjectFormValues, any> }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter project/site name" {...field} className="bg-muted/10 border-border/40 focus:border-primary/50 transition-colors" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }: { field: ControllerRenderProps<ProjectFormValues, any> }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/10 border-border/40">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PARKING">PARKING (Plaza/Toll)</SelectItem>
                      <SelectItem value="BALU">BALU (Construction/Site)</SelectItem>
                      <SelectItem value="OTHER">OTHER (Misc Project)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reportingMode"
              render={({ field }: { field: ControllerRenderProps<ProjectFormValues, any> }) => (
                <FormItem>
                  <FormLabel>Reporting Mode</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-muted/10 border-border/40">
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Non-Cost Centre">Non-Cost Centre</SelectItem>
                      <SelectItem value="Cost Centre">Cost Centre Wise</SelectItem>
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
              name="status"
              render={({ field }: { field: ControllerRenderProps<ProjectFormValues, any> }) => (
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
            name="startDate"
            render={({ field }: { field: ControllerRenderProps<ProjectFormValues, any> }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="bg-muted/10 border-border/40 focus:border-primary/50 transition-colors" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onCancel} className="border-border/40 hover:bg-muted/50 transition-all">
            Cancel
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            {initialData ? "Save Changes" : "Create Project"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
