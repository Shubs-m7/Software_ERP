"use client"

import React from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { parkingSchema, ParkingFormValues } from "@/types/parking"
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
import { Car, User, IndianRupee, CreditCard, Save, AlertCircle } from "lucide-react"
import { usePermission } from "@/hooks/use-permission"
import { cn } from "@/lib/utils"

interface ParkingFormProps {
  onSubmit: (data: ParkingFormValues) => void
  onCancel?: () => void
  initialData?: ParkingFormValues
}

export function ParkingForm({ onSubmit, onCancel, initialData }: ParkingFormProps) {
  const { isUser } = usePermission()
  const isReadOnly = isUser && !!initialData

  const form = useForm<ParkingFormValues>({
    resolver: zodResolver(parkingSchema),
    defaultValues: initialData || {
      vehicleNumber: "",
      name: "",
      paymentMode: "Cash",
      amount: 0,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="vehicleNumber"
            render={({ field }: { field: ControllerRenderProps<ParkingFormValues, "vehicleNumber"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2 uppercase text-xs tracking-wider">
                  <Car className="h-3.5 w-3.5 text-primary" /> Vehicle Number
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter registration no." 
                    {...field} 
                    readOnly={isReadOnly}
                    className={cn(
                      "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-bold uppercase",
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
            name="name"
            render={({ field }: { field: ControllerRenderProps<ParkingFormValues, "name"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2 uppercase text-xs tracking-wider">
                   <User className="h-3.5 w-3.5 text-primary" /> Driver Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter owner/driver name" 
                    {...field} 
                    readOnly={isReadOnly}
                    className={cn(
                      "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-medium",
                      isReadOnly && "opacity-60 cursor-not-allowed"
                    )} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="paymentMode"
            render={({ field }: { field: ControllerRenderProps<ParkingFormValues, "paymentMode"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2 uppercase text-xs tracking-wider">
                  <CreditCard className="h-3.5 w-3.5 text-primary" /> Payment Mode
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
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-border/40 backdrop-blur-3xl">
                    {["Cash", "GPay"].map(mode => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }: { field: ControllerRenderProps<ParkingFormValues, "amount"> }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-bold mb-2 uppercase text-xs tracking-wider">
                  <IndianRupee className="h-3.5 w-3.5 text-primary" /> Amount
                </FormLabel>
                <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      {...field} 
                      readOnly={isReadOnly}
                      onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      className={cn(
                        "h-12 bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-mono font-black text-lg",
                        isReadOnly && "opacity-60 cursor-not-allowed"
                      )}
                    />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-4 pt-4 border-t border-border/40">
          {isUser && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-amber-600/80">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-bold leading-tight uppercase">
                Parking entry once saved cannot be modified. Contact admin for deletions.
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-8 rounded-xl border-border/40 font-bold">
                Cancel
              </Button>
            )}
            {!isReadOnly && (
              <Button type="submit" className="h-12 px-10 rounded-xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2">
                <Save className="h-5 w-5" />
                Save Parking Entry
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  )
}
