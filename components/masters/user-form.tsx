"use client"

import React from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { User, Mail, Phone, Shield, Power, Save } from "lucide-react"
import { User as EnterpriseUser } from "@/types/user"
import { useAppStore } from "@/store/use-app-store"

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits."),
  roleId: z.string().min(1, "Please select a system role."),
  isActive: z.boolean().default(true),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  initialData?: EnterpriseUser | null
}

export function UserForm({ isOpen, onClose, onSubmit, initialData }: UserFormProps) {
  const { roles } = useAppStore()
  
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      mobile: initialData?.mobile || "",
      roleId: initialData?.roleId || "",
      isActive: initialData?.isActive ?? true,
    },
  })

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: initialData?.name || "",
        email: initialData?.email || "",
        mobile: initialData?.mobile || "",
        roleId: initialData?.roleId || "",
        isActive: initialData?.isActive ?? true,
      })
    }
  }, [isOpen, initialData, form])

  const handleFormSubmit = (values: UserFormValues) => {
    onSubmit(values)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-border/40 bg-card/60 backdrop-blur-3xl shadow-3xl max-w-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/50 to-primary" />
        
        <DialogHeader className="pt-6 px-2 space-y-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-7 w-7" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-3xl font-black tracking-tight italic">
              {initialData ? "Refine User Profile" : "Identity Onboarding"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium italic">
              Sovereignty-enforced credentialing for enterprise personnel.
            </DialogDescription>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8 py-6 px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-primary mb-2">
                       <User className="h-3 w-3" /> Personnel Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} className="h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-bold" />
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
                    <FormLabel className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-primary mb-2">
                       <Mail className="h-3 w-3" /> Enterprise Email
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="personnel@enterprise.com" {...field} className="h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-bold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-primary mb-2">
                       <Phone className="h-3 w-3" /> Mobile Identity
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+91 XXXXX XXXXX" {...field} className="h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-mono" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-primary mb-2">
                       <Shield className="h-3 w-3" /> Governance Role
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-bold">
                          <SelectValue placeholder="Assign role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                        {roles.map(role => (
                          <SelectItem key={role.id} value={role.id} className="font-bold italic">
                            {role.name}
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
                name="isActive"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-primary mb-2">
                       <Power className="h-3 w-3" /> Operational Status
                    </FormLabel>
                    <Select 
                      onValueChange={(val) => field.onChange(val === "true")} 
                      value={field.value ? "true" : "false"}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-bold">
                          <SelectValue placeholder="Set status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                        <SelectItem value="true" className="text-emerald-600 font-bold">ACTIVE / FULL ACCESS</SelectItem>
                        <SelectItem value="false" className="text-rose-600 font-bold">INACTIVE / REVOKED</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="rounded-xl h-14 px-8 font-bold">
                Discard Changes
              </Button>
              <Button type="submit" className="rounded-2xl h-14 px-12 bg-primary text-primary-foreground font-black shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 italic tracking-tighter">
                <Save className="h-6 w-6" />
                {initialData ? "COMMIT UPDATES" : "INITIALIZE IDENTITY"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
