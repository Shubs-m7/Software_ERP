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
  IndianRupee, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ArrowRight,
  TrendingDown,
  Activity,
  FileSpreadsheet,
  FileText
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
import { cn } from "@/lib/utils"
import { 
  Bar, 
  BarChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RePieChart
} from "recharts"

// Dummy Dispatch Data Generation
const generateDispatchData = () => {
  const data = []
  const transporters = ["Global Logistics", "Express Freight", "Regional Movers", "Prime Trans"]
  const dates = ["2024-04-10", "2024-04-11", "2024-04-12", "2024-04-13", "2024-04-14"]
  const vehicles = ["GJ 01 AB 1234", "MH 12 CD 5678", "UP 16 XY 9012", "KA 03 MN 4567"]
  
  for (const date of dates) {
    for (const project of projectsData.filter(p => p.type === "BALU" && p.status === "Active")) {
      const trips = 2 + Math.floor(Math.random() * 5)
      for (let i = 0; i < trips; i++) {
        const tonnage = 20 + Math.random() * 10
        const rate = 1200 + Math.random() * 300
        data.push({
          id: `${date}-${project.id}-${i}`,
          date,
          projectName: project.name,
          projectId: project.id,
          transporter: transporters[Math.floor(Math.random() * transporters.length)],
          vehicleNo: vehicles[Math.floor(Math.random() * vehicles.length)],
          tonnage,
          rate,
          total: tonnage * rate
        })
      }
    }
  }
  return data
}

export default function DispatchSummaryReport() {
  const { user } = useAppStore()
  const isLockdown = !!(user && user.allowedProjectIds.length === 1)
  
  const [data] = useState(generateDispatchData())
  const [projectFilter, setProjectFilter] = useState(isLockdown ? user?.allowedProjectIds[0] : "all")
  const [dateFrom, setDateFrom] = useState("2024-04-10")
  const [dateTo, setDateTo] = useState("2024-04-14")

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchProject = projectFilter === "all" || row.projectId === projectFilter
      const matchDate = row.date >= dateFrom && row.date <= dateTo
      return matchProject && matchDate
    })
  }, [projectFilter, dateFrom, dateTo, data])

  const stats = useMemo(() => {
    const totals = filteredData.reduce((acc, curr) => ({
      tonnage: acc.tonnage + curr.tonnage,
      total: acc.total + curr.total,
      trips: acc.trips + 1
    }), { tonnage: 0, total: 0, trips: 0 })
    
    return {
      ...totals,
      avgRate: totals.tonnage > 0 ? totals.total / totals.tonnage : 0,
      avgLoad: totals.trips > 0 ? totals.tonnage / totals.trips : 0
    }
  }, [filteredData])

  const chartData = useMemo(() => {
    const dailyMap = new Map()
    filteredData.forEach(row => {
      dailyMap.set(row.date, (dailyMap.get(row.date) || 0) + row.tonnage)
    })
    return Array.from(dailyMap.entries())
      .map(([name, tons]) => ({ name: name.split('-').slice(2).join('/'), tons: Math.round(tons) }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredData])

  const transporterData = useMemo(() => {
    const transMap = new Map()
    filteredData.forEach(row => {
      transMap.set(row.transporter, (transMap.get(row.transporter) || 0) + row.tonnage)
    })
    return Array.from(transMap.entries())
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
  }, [filteredData])

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic border-l-8 border-primary pl-6">
            Dispatch Summary
          </h1>
          <p className="text-muted-foreground font-medium ml-8 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Material dispatch volume and logistics partner performance analytics.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-md hover:bg-primary/5 hover:text-primary transition-all font-bold gap-2 h-12 px-6">
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-md hover:bg-primary/5 hover:text-primary transition-all font-bold gap-2 h-12 px-6">
            <FileText className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="rounded-[2.5rem] border-primary/10 bg-gradient-to-br from-primary/5 via-background to-background backdrop-blur-xl shadow-2xl overflow-hidden">
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
               <Calendar className="h-3 w-3" /> Date Range
             </label>
             <div className="grid grid-cols-2 gap-2">
                <Input 
                  type="date" 
                  value={dateFrom} 
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-12 bg-white/50 border-border/40 rounded-xl font-bold text-sm" 
                />
                <Input 
                  type="date" 
                  value={dateTo} 
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-12 bg-white/50 border-border/40 rounded-xl font-bold text-sm" 
                />
             </div>
           </div>

           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2 px-1">
               <Building2 className="h-3 w-3" /> Balu Project
             </label>
             <Select value={projectFilter} onValueChange={setProjectFilter} disabled={isLockdown}>
               <SelectTrigger className="h-12 bg-white/50 border-border/40 rounded-xl font-bold">
                 <SelectValue placeholder="All Sites" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl">
                 <SelectItem value="all" className="font-bold italic">All Active Sites</SelectItem>
                 {projectsData.filter(p => p.type === "BALU").map(p => (
                    <SelectItem key={p.id} value={p.id} className="font-bold">{p.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div className="md:col-span-2">
             <Button className="h-12 w-full rounded-2xl bg-primary shadow-xl shadow-primary/20 font-black flex items-center gap-3 hover:scale-[1.02] transition-all">
               <Search className="h-5 w-5" />
               GENERATE ANALYTICS
             </Button>
           </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Tonnage", value: `${Math.round(stats.tonnage)}t`, icon: <Weight className="h-5 w-5" />, color: "blue", sub: `${stats.trips} Total Trips` },
          { label: "Net Billing", value: `₹${(stats.total / 100000).toFixed(2)}L`, icon: <IndianRupee className="h-5 w-5" />, color: "emerald", sub: "Calculated Revenue" },
          { label: "Avg Rate", value: `₹${Math.round(stats.avgRate)}`, icon: <BarChart3 className="h-5 w-5" />, color: "amber", sub: "Per Ton Average" },
          { label: "Efficiency", value: `${Math.round(stats.avgLoad)}t`, icon: <TrendingUp className="h-5 w-5" />, color: "violet", sub: "Avg Load per Trip" },
        ].map((kpi) => (
          <Card key={kpi.label} className="rounded-3xl border-border/40 bg-card/20 backdrop-blur-md shadow-xl transition-all hover:translate-y-[-4px]">
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{kpi.label}</p>
                  <p className={cn("text-3xl font-black tracking-tighter", `text-${kpi.color}-600`)}>
                    {kpi.value}
                  </p>
                  <p className="text-[10px] font-bold text-muted-foreground mt-1 opacity-60">{kpi.sub}</p>
               </div>
               <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center bg-white shadow-inner", `text-${kpi.color}-500/50`)}>
                 {kpi.icon}
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Group */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Daily Dispatch Volume
             </CardTitle>
             <CardDescription>Aggregate tonnage moved across all selected sites</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                   <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke="#888" />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="#888" tickFormatter={(v) => `${v}t`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                      />
                      <Bar dataKey="tons" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
                      <defs>
                        <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#60a5fa" />
                        </linearGradient>
                      </defs>
                   </BarChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 bg-card/30 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Transporter Split
             </CardTitle>
             <CardDescription>Volume distribution by logistics partner</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                   <RePieChart>
                      <Pie
                        data={transporterData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {transporterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                   </RePieChart>
                </ResponsiveContainer>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="rounded-[2.5rem] border border-border/40 bg-white/40 backdrop-blur-md shadow-3xl overflow-hidden mb-12">
        <Table>
          <TableHeader className="bg-muted/50 h-20">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="px-8 font-black uppercase tracking-widest text-[10px]">Date</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Project Site</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Transporter</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[10px]">Truck No</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-blue-600">Tonnage (t)</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[10px] text-primary">Total Billing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id} className="border-border/40 hover:bg-primary/5 transition-colors h-16 group">
                <TableCell className="px-8 font-mono font-bold text-muted-foreground italic">{row.date}</TableCell>
                <TableCell className="font-black text-foreground">{row.projectName}</TableCell>
                <TableCell className="font-bold text-muted-foreground uppercase text-[11px]">{row.transporter}</TableCell>
                <TableCell className="font-mono font-black text-primary px-3 py-1 rounded-lg bg-primary/5 inline-block my-4">
                  {row.vehicleNo}
                </TableCell>
                <TableCell className="text-right font-black text-blue-600">{row.tonnage.toFixed(2)}</TableCell>
                <TableCell className="px-8 text-right font-black font-mono text-primary">
                  ₹{row.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot className="bg-primary/5 border-t border-border/40">
            <TableRow className="h-20 hover:bg-transparent">
              <TableCell colSpan={4} className="px-8 text-sm font-black uppercase tracking-widest text-primary">CONSOLIDATED DISPATCH TOTALS</TableCell>
              <TableCell className="text-right font-mono font-black text-lg text-blue-700">{stats.tonnage.toFixed(2)} t</TableCell>
              <TableCell className="px-8 text-right font-mono font-black text-2xl text-primary">₹{stats.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </div>

    </div>
  )
}
