"use client"

import React, { useMemo } from "react"
import { useForm, ControllerRenderProps } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Building2, IndianRupee, Wallet, Smartphone, Landmark, Activity, Save } from "lucide-react"
import { collectionSchema, CollectionFormValues } from "@/types/collection"
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
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { usePermission } from "@/hooks/use-permission"
import { AlertCircle } from "lucide-react"

export default function DailyCollectionPage() {
  const { isUser, canBackdate } = usePermission()
  
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      projectId: "",
      shiftA: 0,
      shiftB: 0,
      shiftC: 0,
      etc: 0,
      posOnline: 0,
      monthlyPass: 0,
      otherCash: 0,
      otherUPI: 0,
      otherBankPhone: 0,
      overloadCollection: 0,
      remarks: "",
    },
  })

  // Watch all numeric values for live calculation
  const values = form.watch()

  const totals = useMemo(() => {
    // Cash heads: Shift A+B+C + Other Cash + Overload
    const cash = (values.shiftA || 0) + (values.shiftB || 0) + (values.shiftC || 0) + (values.otherCash || 0) + (values.overloadCollection || 0)
    // UPI heads: ETC + POS/Online + Other UPI + Other Bank/Phone
    const upi = (values.etc || 0) + (values.posOnline || 0) + (values.otherUPI || 0) + (values.otherBankPhone || 0)
    // Grand Total
    const grand = cash + upi + (values.monthlyPass || 0)
    
    return {
      totalCash: cash,
      totalUPI: upi,
      grandTotal: grand
    }
  }, [values])

  const onSubmit = (data: CollectionFormValues) => {
    console.log("Submitted Data:", { ...data, ...totals })
    alert("Daily Collection Recorded Successfully!")
    form.reset()
  }

  // Filter only PARKING projects for shift-wise entry
  const parkingProjects = projectsData.filter(p => p.type === "PARKING")

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-black tracking-tighter text-foreground italic flex items-center gap-3">
          Daily Collection <span className="text-primary italic">Entry Console</span>
        </h1>
        <p className="text-muted-foreground font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Shift-based operational log for high-frequency site collections.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Main Entry Section */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Context Card (Date & Project) */}
            <Card className="rounded-[2.5rem] border-border/40 bg-card/30 backdrop-blur-md shadow-2xl overflow-hidden glass-card">
              <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }: { field: ControllerRenderProps<CollectionFormValues, "date"> }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1 mb-2">
                        <Calendar className="h-3 w-3" /> Entry Date
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          readOnly={isUser}
                          className={cn(
                            "h-14 bg-muted/10 border-border/40 focus:border-primary/50 text-lg font-bold rounded-2xl px-6",
                            isUser && "opacity-60 cursor-not-allowed"
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
                  render={({ field }: { field: ControllerRenderProps<CollectionFormValues, "projectId"> }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1 mb-2">
                        <Building2 className="h-3 w-3" /> Select Site
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-14 bg-muted/10 border-border/40 text-lg font-bold rounded-2xl px-6">
                            <SelectValue placeholder="Select site" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl">
                          {parkingProjects.map(project => (
                            <SelectItem key={project.id} value={project.id} className="h-12 font-bold">{project.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Shifts Grid */}
            <div className="space-y-6">
              <h3 className="text-xl font-black italic flex items-center gap-3 px-2 tracking-tight">
                <Wallet className="h-6 w-6 text-amber-500" />
                Physical Cash Handover (Shifts)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["shiftA", "shiftB", "shiftC"].map((shift, idx) => (
                  <Card key={shift} className="rounded-3xl border-border/40 bg-card/20 backdrop-blur-sm shadow-xl hover:border-amber-500/50 transition-all group">
                    <CardContent className="p-8">
                      <FormField
                        control={form.control}
                        name={shift as any}
                        render={({ field }: { field: ControllerRenderProps<CollectionFormValues, any> }) => (
                          <FormItem>
                            <FormLabel className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-4 block">Shift {String.fromCharCode(65 + idx)}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <IndianRupee className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                                <Input 
                                  type="number" 
                                  step="0.01"
                                  placeholder="0.00" 
                                  {...field} 
                                  onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                                  className="pl-8 h-12 bg-transparent border-none text-2xl font-black font-mono focus:ring-0 shadow-none" 
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Digital & Non-Shift Grid */}
            <div className="space-y-6">
              <h3 className="text-xl font-black italic flex items-center gap-3 px-2 tracking-tight">
                <Smartphone className="h-6 w-6 text-blue-500" />
                Digital & Ancillary Collections
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: "etc", label: "ETC Collection", icon: <Landmark className="h-4 w-4 text-blue-500" /> },
                  { name: "posOnline", label: "POS / Online Pass", icon: <Smartphone className="h-4 w-4 text-blue-500" /> },
                  { name: "otherBankPhone", label: "Other Bank/Phone", icon: <Landmark className="h-4 w-4 text-blue-500" /> },
                  { name: "monthlyPass", label: "Monthly Pass", icon: <Building2 className="h-4 w-4 text-amber-500" /> },
                  { name: "overloadCollection", label: "Overload Collection", icon: <Activity className="h-4 w-4 text-amber-500" /> },
                  { name: "otherCash", label: "Other Misc Cash", icon: <IndianRupee className="h-4 w-4 text-amber-500" /> },
                  { name: "otherUPI", label: "Other Local UPI", icon: <Smartphone className="h-4 w-4 text-blue-500" /> },
                ].map((item) => (
                  <Card key={item.name} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md p-6 group hover:border-primary/30 transition-all flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-card/50 flex items-center justify-center shadow-inner group-hover:bg-primary/5 transition-colors">
                       {item.icon}
                    </div>
                    <div className="flex-1">
                       <FormLabel className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1 block">{item.label}</FormLabel>
                       <FormField
                        control={form.control}
                        name={item.name as any}
                        render={({ field }: { field: ControllerRenderProps<CollectionFormValues, any> }) => (
                          <Input 
                            type="number" 
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            className="bg-transparent border-none h-8 p-0 text-xl font-black font-mono focus-visible:ring-0 shadow-none"
                          />
                        )}
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Remarks Section */}
            <Card className="rounded-[2rem] border-border/40 bg-card/10 p-8 shadow-xl">
               <FormField
                  control={form.control}
                  name="remarks"
                  render={({ field }: { field: ControllerRenderProps<CollectionFormValues, "remarks"> }) => (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase text-primary tracking-widest px-1 mb-2 block">Operational Remarks / Notes</FormLabel>
                      <FormControl>
                        <textarea 
                          {...field}
                          placeholder="Log any discrepancies, maintenance issues, or shift handover notes here..."
                          className="w-full min-h-[120px] bg-muted/10 border border-border/40 rounded-2xl p-6 text-sm font-medium focus:border-primary/50 focus:ring-0 transition-all"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-8">
            <Card className="rounded-[3rem] border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background backdrop-blur-3xl shadow-3xl sticky top-8 overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Landmark className="h-24 w-24 text-primary" />
              </div>
              <CardContent className="p-10 space-y-10 relative">
                <div className="space-y-2">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">Unified Net Remittance</h2>
                  <div className="text-5xl font-black tracking-tighter text-foreground font-mono italic">
                    ₹{totals.grandTotal.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest opacity-60">Verified Grand Total</p>
                </div>

                <div className="space-y-6">
                  <div className="p-6 rounded-[2rem] bg-amber-500/10 border border-amber-500/20 group hover:bg-amber-500/[0.15] transition-all">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest">Total Physical Cash</p>
                       <Wallet className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="text-3xl font-black font-mono italic tracking-tighter">₹{totals.totalCash.toLocaleString('en-IN')}</p>
                  </div>

                  <div className="p-6 rounded-[2rem] bg-blue-500/10 border border-blue-500/20 group hover:bg-blue-500/[0.15] transition-all">
                    <div className="flex items-center justify-between mb-2">
                       <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Total Digital / UPI</p>
                       <Smartphone className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-black font-mono italic tracking-tighter">₹{totals.totalUPI.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <Separator className="bg-border/20" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest px-2 text-muted-foreground italic">
                    <span>Monthly Pass Share</span>
                    <span className="font-mono text-foreground">₹{(values.monthlyPass || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-20 rounded-[2rem] bg-primary text-primary-foreground text-xl font-black shadow-3xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all group"
                >
                  <Save className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                  RECONCILE & POST
                </Button>
              </CardContent>
            </Card>

            <Alert className="rounded-[2rem] border-amber-500/20 bg-amber-500/5 text-amber-600 p-8">
               <AlertCircle className="h-5 w-5" />
               <AlertTitle className="font-black uppercase tracking-[0.15em] text-[10px] mb-2">Audit Compliance Reminder</AlertTitle>
               <AlertDescription className="text-xs font-medium italic leading-relaxed opacity-80">
                  Ensure all shift figures exactly match the physical cash handover. Discrepancies exceeding ₹100 will trigger an automated change request for administrative review.
               </AlertDescription>
            </Alert>
          </div>

        </form>
      </Form>
    </div>
  )
}
