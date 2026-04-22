"use client"

import React, { useState, useMemo } from "react"
import { 
  Calendar, 
  Building2, 
  Truck, 
  Search, 
  Clock, 
  ShieldCheck,
  History,
  Activity,
  ArrowRight,
  TrendingUp,
  MapPin,
  ClipboardList,
  IndianRupee,
  Smartphone,
  Wallet
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

// Dummy Parking Log Data
const generateParkingLog = () => {
  const data = []
  const vehicles = [
    { no: "MH 12 AB 1234", type: "Car/Jeep/Van" },
    { no: "GJ 01 CD 5678", type: "LCV" },
    { no: "UP 16 XY 9012", type: "ParkingCircle/Truck" },
    { no: "KA 03 MN 4567", type: "3-Axle" },
    { no: "DL 01 ZY 1122", type: "MAV (4-6 Axle)" },
    { no: "RJ 14 GB 3344", type: "Over-sized" }
  ]
  const dates = ["2024-04-10", "2024-04-11", "2024-04-12", "2024-04-13", "2024-04-14"]
  const modes = ["CASH", "UPI", "PASS"]
  
  for (let i = 0; i < 50; i++) {
    const v = vehicles[Math.floor(Math.random() * vehicles.length)]
    const date = dates[Math.floor(Math.random() * dates.length)]
    const mode = modes[Math.floor(Math.random() * modes.length)]
    const project = projectsData.filter(p => p.type === "PARKING" && p.status === "Active")[Math.floor(Math.random() * 2)]
    
    let amount = 0
    if (v.type === "Car/Jeep/Van") amount = 120
    else if (v.type === "LCV") amount = 200
    else if (v.type === "ParkingCircle/Truck") amount = 420
    else amount = 650

    data.push({
      id: `tlog-${i}`,
      date,
      time: `${1 + Math.floor(Math.random() * 12)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      vehicleNo: v.no,
      type: v.type,
      project: project?.name || "Parking Zone A",
      mode,
      amount: mode === "PASS" ? 0 : amount,
      status: "Verified"
    })
  }
  return data.sort((a, b) => b.date.localeCompare(a.date))
}

export default function ParkingLogPage() {
  const [logData] = useState(generateParkingLog())
  const [searchQuery, setSearchQuery] = useState("")
  const [projectFilter, setProjectFilter] = useState("all")

  const filteredData = useMemo(() => {
    return logData.filter(row => {
      const matchQuery = row.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())
      const matchProject = projectFilter === "all" || row.project === projectFilter
      return matchQuery && matchProject
    })
  }, [searchQuery, projectFilter, logData])

  const stats = useMemo(() => {
    const totalVehicles = filteredData.length
    const totalCash = filteredData.filter(d => d.mode === "CASH").length
    const totalUPI = filteredData.filter(d => d.mode === "UPI").length
    const totalAmount = filteredData.reduce((acc, curr) => acc + curr.amount, 0)
    
    return {
      totalVehicles,
      totalAmount,
      cashRatio: totalVehicles > 0 ? (totalCash / totalVehicles * 100).toFixed(0) : 0,
      upiRatio: totalVehicles > 0 ? (totalUPI / totalVehicles * 100).toFixed(0) : 0
    }
  }, [filteredData])

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <History className="h-3 w-3" />
             Real-time Parking Archive
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Zone <span className="text-blue-600 italic">Parking Log</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-600" />
            Detailed vehicle-wise crossing history and payment audit trail.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Card className="px-6 py-3 rounded-2xl bg-card border border-border/40 shadow-xl flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                 <p className="text-[9px] font-black uppercase text-muted-foreground leading-none">Security Status</p>
                 <p className="text-sm font-black text-foreground">Audit Verified</p>
              </div>
           </Card>
        </div>
      </div>

      {/* Control Bar */}
      <Card className="rounded-[2.5rem] border-blue-500/10 bg-gradient-to-br from-blue-500/5 via-background to-background backdrop-blur-3xl shadow-3xl overflow-hidden">
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
           
           <div className="md:col-span-5 space-y-2">
             <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2 px-1">
               <Search className="h-3 w-3" /> Search Vehicle No
             </label>
             <div className="relative">
                <Input 
                  placeholder="e.g. MH 12 AB 1234..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-12 bg-white/50 border-border/40 rounded-2xl font-bold text-lg placeholder:text-blue-600/20 focus:ring-blue-600/20 transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600/40" />
             </div>
           </div>

           <div className="md:col-span-4 space-y-2">
             <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2 px-1">
               <Building2 className="h-3 w-3" /> Filter Zone
             </label>
             <Select value={projectFilter} onValueChange={setProjectFilter}>
               <SelectTrigger className="h-14 bg-white/50 border-border/40 rounded-2xl font-bold">
                 <SelectValue placeholder="All Zones" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl">
                 <SelectItem value="all" className="font-bold">All Active Zones</SelectItem>
                 {projectsData.filter(p => p.type === "PARKING").map(p => (
                   <SelectItem key={p.id} value={p.name} className="font-bold">{p.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div className="md:col-span-3">
              <Button className="h-14 w-full rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-500/20 flex items-center gap-3 hover:scale-[1.02] transition-all">
                <ClipboardList className="h-5 w-5" />
                REFRESH LOGS
              </Button>
           </div>

        </CardContent>
      </Card>

      {/* Occupancy Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {[
           { label: "Total Occupancy", value: stats.totalVehicles, icon: <Activity className="h-4 w-4" />, color: "blue", sub: "Vehicle Entrys" },
           { label: "Net Collection", value: `₹${(stats.totalAmount / 1000).toFixed(1)}k`, icon: <IndianRupee className="h-4 w-4" />, color: "emerald", sub: "Total Revenue" },
           { label: "Cash Ratio", value: `${stats.cashRatio}%`, icon: <Wallet className="h-4 w-4" />, color: "amber", sub: "Physical Payment" },
           { label: "UPI Ratio", value: `${stats.upiRatio}%`, icon: <Smartphone className="h-4 w-4" />, color: "blue", sub: "Digital Payment" },
         ].map((kpi) => (
           <div key={kpi.label} className="p-6 rounded-3xl bg-white/40 border border-border/40 backdrop-blur-md flex items-center gap-4 group hover:bg-white/60 transition-all">
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center bg-card shadow-inner group-hover:scale-110 transition-transform", `text-${kpi.color}-500`)}>
                 {kpi.icon}
              </div>
              <div className="space-y-0.5">
                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{kpi.label}</p>
                 <p className="text-2xl font-black text-foreground tracking-tighter leading-none">{kpi.value}</p>
                 <p className="text-[9px] font-bold text-muted-foreground/60 tracking-wider mt-1">{kpi.sub}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Main Table */}
      <Card className="rounded-[2.5rem] border border-border/40 bg-card/20 backdrop-blur-xl shadow-3xl overflow-hidden mb-12">
        <Table>
          <TableHeader className="bg-muted/40 h-20">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="px-8 font-black uppercase tracking-widest text-[10px]">Vehicle & Class</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Entry Time</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Zone Location</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Payment Mode</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-blue-600 px-8">Amount Paid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow key={row.id} className="border-border/40 hover:bg-blue-500/5 transition-colors h-24 group">
                  <TableCell className="px-8">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs border border-blue-200">
                           {row.vehicleNo.split(' ').pop()?.slice(0, 2)}
                        </div>
                        <div>
                           <p className="text-[11px] font-black text-blue-600 uppercase tracking-wider mb-0.5">{row.vehicleNo}</p>
                           <p className="text-xs font-bold text-foreground opacity-60 italic">{row.type}</p>
                        </div>
                     </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                       <p className="font-mono font-bold text-[11px] text-muted-foreground flex items-center gap-1.5 uppercase tracking-tighter">
                          <Calendar className="h-3 w-3" /> {row.date}
                       </p>
                       <p className="font-mono font-bold text-[11px] text-blue-600/80 flex items-center gap-1.5 uppercase tracking-tighter px-1">
                          <Clock className="h-3 w-3" /> {row.time}
                       </p>
                    </div>
                  </TableCell>
                  <TableCell>
                     <p className="text-sm font-black text-foreground uppercase tracking-tight flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-blue-500/40" />
                        {row.project}
                     </p>
                  </TableCell>
                  <TableCell>
                     <Badge variant="outline" className={cn(
                       "rounded-full font-black text-[9px] uppercase px-3 py-0.5 border-border/60",
                       row.mode === "CASH" ? "text-amber-600 border-amber-200 bg-amber-50" :
                       row.mode === "UPI" ? "text-blue-600 border-blue-200 bg-blue-50" :
                       "text-emerald-600 border-emerald-200 bg-emerald-50"
                     )}>
                        {row.mode === "CASH" ? <Wallet className="h-2.5 w-2.5 mr-1" /> :
                         row.mode === "UPI" ? <Smartphone className="h-2.5 w-2.5 mr-1" /> :
                         <ShieldCheck className="h-2.5 w-2.5 mr-1" />}
                        {row.mode}
                     </Badge>
                  </TableCell>
                  <TableCell className="px-8 text-right font-mono font-black text-blue-600 text-lg">
                    ₹{row.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={6} className="h-64 text-center">No logs found</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

    </div>
  )
}
