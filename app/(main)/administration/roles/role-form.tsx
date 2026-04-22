"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DynamicRole, PermissionRule } from "@/types/settings"
import { Shield, Eye, Plus, Edit3, Trash2 } from "lucide-react"

const roleSchema = z.object({
  name: z.string().min(2, "Role name is required."),
  permissions: z.record(z.object({
    view: z.boolean(),
    create: z.boolean(),
    edit: z.boolean(),
    delete: z.boolean(),
  }))
})

type RoleFormValues = z.infer<typeof roleSchema>

interface RoleFormProps {
  initialData?: DynamicRole | null
  onSubmit: (data: RoleFormValues) => void
  onCancel: () => void
}

const MODULES = [
  { id: "dashboard", label: "Dashboard Hub" },
  { id: "masters", label: "Master Data" },
  { id: "transactions", label: "Transactions" },
  { id: "reports", label: "Reporting MIS" },
  { id: "users", label: "Administration" }
]

export function RoleForm({ initialData, onSubmit, onCancel }: RoleFormProps) {
  const form = useForm<RoleFormValues>({
    resolver: zodResolver(roleSchema),
    defaultValues: initialData || {
      name: "",
      permissions: {
        dashboard: { view: true, create: false, edit: false, delete: false },
        masters: { view: false, create: false, edit: false, delete: false },
        transactions: { view: false, create: false, edit: false, delete: false },
        reports: { view: false, create: false, edit: false, delete: false },
        users: { view: false, create: false, edit: false, delete: false }
      }
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6 overflow-y-auto max-h-[85vh]">
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
             <Shield className="h-6 w-6 text-primary" />
             {initialData ? "Update Privileges" : "Define New Role"}
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
             Configure granular module access for this enterprise role.
          </p>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-[10px] font-black uppercase tracking-widest opacity-60">Role Designation</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Master Auditor, Site Manager" className="h-14 rounded-2xl bg-muted/30 border-border/40 font-bold px-6" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
           <p className="text-[10px] font-black uppercase tracking-widest text-primary px-1">Permission Matrix</p>
           
           <div className="rounded-[2rem] border border-border/40 bg-muted/10 overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-muted/30">
                    <tr>
                       <th className="p-5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Module</th>
                       <th className="p-5 text-center"><Eye className="h-4 w-4 mx-auto text-muted-foreground" /></th>
                       <th className="p-5 text-center"><Plus className="h-4 w-4 mx-auto text-muted-foreground" /></th>
                       <th className="p-5 text-center"><Edit3 className="h-4 w-4 mx-auto text-muted-foreground" /></th>
                       <th className="p-5 text-center"><Trash2 className="h-4 w-4 mx-auto text-muted-foreground" /></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-border/20">
                    {MODULES.map((module) => (
                       <tr key={module.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-5 text-sm font-bold text-foreground italic">{module.label}</td>
                          {["view", "create", "edit", "delete"].map((action) => (
                             <td key={action} className="p-5 text-center">
                                <FormField
                                  control={form.control}
                                  name={`permissions.${module.id}.${action}` as any}
                                  render={({ field }) => (
                                    <FormItem>
                                       <FormControl>
                                          <Checkbox 
                                            checked={field.value} 
                                            onCheckedChange={field.onChange} 
                                            className="h-5 w-5 rounded-md border-border/60 data-[state=checked]:bg-primary"
                                          />
                                       </FormControl>
                                    </FormItem>
                                  )}
                                />
                             </td>
                          ))}
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border/20">
          <Button variant="ghost" type="button" onClick={onCancel} className="rounded-xl h-12 px-6 font-bold">
            Discard
          </Button>
          <Button type="submit" className="rounded-2xl h-12 px-10 bg-primary font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            {initialData ? "Update Role" : "Create Enterprise Role"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
