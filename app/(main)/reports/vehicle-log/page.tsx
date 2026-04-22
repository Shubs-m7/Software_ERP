"use client"

import React, { useState, useMemo } from "react"
import { useAppStore } from "@/store/use-app-store"
import { 
  Calendar, 
  Building2, 
  Truck, 
  Search, 
  Filter, 
  Weight, 
  Clock, 
  ShieldCheck,
  History,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  ClipboardList
} from "lucide-react"
import { projectsData } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Dummy Truck Log Data
const generateTruckLog = () => {
  const data = []
  const transporters = ["Global Logistics", "Express Freight", "Regional Movers", "Prime Trans"]
  const vehicles = [
    { no: "GJ 01 AB 1234", driver: "Rajesh K.", type: "10-Tyre" },
    { no: "MH 12 CD 5678", driver: "Amit S.", type: "12-Tyre" },
    { no: "UP 16 XY 9012", driver: "Mohan L.", type: "Dumper" },
    { no: "KA 03 MN 4567", driver: "Suresh P.", type: "10-Tyre" },
    { no: "HR 55 ZY 1122", driver: "Deepak B.", type: "12-Tyre" },
    { no: "RJ 14 GB 3344", driver: "Vikram R.", type: "Dumper" }
  ]
  const dates = ["2024-04-10", "2024-04-11", "2024-04-12", "2024-04-13", "2024-04-14"]
  
  for (const v of vehicles) {
    const tripCount = 5 + Math.floor(Math.random() * 10)
    for (let i = 0; i < tripCount; i++) {
      const date = dates[Math.floor(Math.random() * dates.length)]
      const activeBaluProjects = projectsData.filter(p => p.type === "BALU" && p.status === "Active")
      const project = activeBaluProjects[Math.floor(Math.random() * activeBaluProjects.length)]
      const tonnage = 20 + Math.random() * 15
      
      if (project) {
        data.push({
          id: `vlog-${v.no}-${i}`,
          date,
          time: `${1 + Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
          vehicleNo: v.no,
          type: v.type,
          driver: v.driver,
          transporter: transporters[Math.floor(Math.random() * transporters.length)],
          projectName: project.name,
          tonnage: tonnage.toFixed(2),
          status: Math.random() > 0.1 ? "Delivered" : "In Transit"
        })
      }
    }
  }
  return data.sort((a, b) => b.date.localeCompare(a.date))
}

export default function TruckLogPage() {
  const { user } = useAppStore()
  const isLockdown = !!(user && user.allowedProjectIds.length === 1)

  const [logData] = useState(generateTruckLog())
  const [searchQuery, setSearchQuery] = useState("")
  const [projectFilter, setProjectFilter] = useState(isLockdown ? projectsData.find(p => p.id === user?.allowedProjectIds[0])?.name || "all" : "all")

  const filteredData = useMemo(() => {
    return logData.filter(row => {
      const matchQuery = row.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         row.driver.toLowerCase().includes(searchQuery.toLowerCase())
      const matchProject = projectFilter === "all" || row.projectName === projectFilter
      return matchQuery && matchProject
    })
  }, [searchQuery, projectFilter, logData])

  const stats = useMemo(() => {
    const uniqueTrucks = new Set(filteredData.map(d => d.vehicleNo)).size
    const totalTrips = filteredData.length
    const totalTons = filteredData.reduce((acc, curr) => acc + parseFloat(curr.tonnage), 0)
    
    return {
      uniqueTrucks,
      totalTrips,
      totalTons: totalTons.toFixed(0),
      avgTons: totalTrips > 0 ? (totalTons / totalTrips).toFixed(1) : 0
    }
  }, [filteredData])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <History className="h-3 w-3" />
             Historical Audit Logs
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Heavy <span className="text-primary italic">Truck Log</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" />
            Detailed truck-wise tracking and material logistics historical audit.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Card className="px-6 py-3 rounded-2xl bg-card/20 backdrop-blur-md shadow-xl border-emerald-500/10 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                 <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase text-emerald-600/60 leading-none">Logistics Verified</p>
                 <p className="text-sm font-black text-foreground">Tamper-proof Logs</p>
              </div>
           </Card>
        </div>
      </div>

      {/* Control Bar */}
      <Card className="rounded-[2.5rem] border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background backdrop-blur-3xl shadow-3xl overflow-hidden">
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
           
           <div className="md:col-span-5 space-y-2">
             <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
               <Search className="h-3 w-3" /> Search Truck or Driver
             </label>
             <div className="relative">
                <Input 
                  placeholder="e.g. GJ 01 AB 1234..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 bg-white/50 border-border/40 rounded-2xl font-bold text-lg placeholder:text-muted-foreground/30 focus:ring-primary/20 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/40" />
             </div>
           </div>

           <div className="md:col-span-4 space-y-2">
             <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
               <Building2 className="h-3 w-3" /> Balu Project
             </label>
             <Select value={projectFilter} onValueChange={setProjectFilter} disabled={isLockdown}>
               <SelectTrigger className="h-14 bg-white/50 border-border/40 rounded-2xl font-bold">
                 <SelectValue placeholder="All Sites" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl">
                 <SelectItem value="all" className="font-bold">All Active Sites</SelectItem>
                 {projectsData.filter(p => p.type === "BALU").map(p => (
                   <SelectItem key={p.id} value={p.name} className="font-bold">{p.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div className="md:col-span-3">
              <Button className="h-14 w-full rounded-2xl bg-emerald-600 text-white font-black shadow-xl shadow-emerald-500/20 flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
                <ClipboardList className="h-5 w-5" />
                REFRESH LOGS
              </Button>
           </div>

        </CardContent>
      </Card>

      {/* Fleet Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Active Trucks", value: stats.uniqueTrucks, icon: <Truck className="h-4 w-4" />, color: "primary" },
           { label: "Total Trips", value: stats.totalTrips, icon: <Activity className="h-4 w-4" />, color: "emerald" },
           { label: "Material Weight", value: `${stats.totalTons}t`, icon: <Weight className="h-4 w-4" />, color: "blue" },
           { label: "Avg Load", value: `${stats.avgTons}t`, icon: <TrendingUp className="h-4 w-4" />, color: "amber" },
         ].map((kpi) => (
           <div key={kpi.label} className="p-6 rounded-3xl bg-white/40 border border-border/40 backdrop-blur-md flex items-center gap-4 group hover:bg-white/60 transition-all">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center bg-card shadow-inner group-hover:scale-110 transition-transform", `text-${kpi.color}`)}>
                 {kpi.icon}
              </div>
              <div className="space-y-0.5">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
                 <p className="text-2xl font-black text-foreground tracking-tighter leading-none">{kpi.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Main Log Table */}
      <div className="rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-xl shadow-3xl overflow-hidden mb-12">
        <Table>
          <TableHeader className="bg-muted/40 h-20">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="px-8 font-black uppercase tracking-widest text-[10px]">Truck & Driver</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Timestamp</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Project Site</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Transporter</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-blue-600">Load Factor</TableHead>
              <TableHead className="px-8 text-right font-black uppercase tracking-widest text-[10px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id} className="border-border/40 hover:bg-primary/5 transition-colors h-24 group">
                  <TableCell className="px-8">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs border border-primary/20">
                           {row.vehicleNo.split(' ').pop()?.slice(0, 2)}
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-primary uppercase tracking-wider mb-0.5">{row.vehicleNo}</p>
                           <p className="text-sm font-bold text-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {row.driver}
                           </p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                       <p className="font-mono font-bold text-[11px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-tighter">
                          <Calendar className="h-3 w-3" /> {row.date}
                       </p>
                       <p className="font-mono font-bold text-[11px] text-emerald-600/80 flex items-center gap-1.5 uppercase tracking-tighter px-1">
                          <Clock className="h-3 w-3" /> {row.time}
                       </p>
                    </div>
                  </TableCell>
                  <TableCell>
                     <p className="text-sm font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-primary/40" />
                        {row.projectName}
                     </p>
                  </TableCell>
                  <TableCell>
                     <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70 tracking-widest">{row.transporter}</p>
                     <Badge variant="secondary" className="rounded-full bg-muted/50 text-[8px] font-black py-0 px-2 mt-1 uppercase">{row.type}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                     <div className="inline-flex flex-col items-end">
                        <p className="text-lg font-black text-blue-700 tracking-tighter leading-none">{row.tonnage} t</p>
                        <div className="h-1 w-12 bg-blue-100 rounded-full mt-1 overflow-hidden">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(100, (parseFloat(row.tonnage)/35)*100)}%` }} />
                        </div>
                     </div>
                  </TableCell>
                  <TableCell className="px-8 text-right">
                     <Badge variant={row.status === "Delivered" ? "outline" : "secondary"} className={cn(
                       "rounded-full font-black text-[10px] uppercase px-3 py-1",
                       row.status === "Delivered" ? "border-emerald-500/30 text-emerald-600 bg-emerald-50" : "bg-blue-50 text-blue-600 border-blue-500/30"
                     )}>
                        {row.status}
                     </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                   <div className="flex flex-col items-center gap-4 opacity-30">
                      <Search className="h-12 w-12" />
                      <p className="text-xl font-black uppercase tracking-tighter">No vehicle logs matching your filter</p>
                   </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  )
}
