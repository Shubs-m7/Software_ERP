"use client"

import React, { useState, useMemo } from "react"
import { 
  Area, 
  AreaChart, 
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
import { 
  Activity, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  Building2, 
  Search, 
  Wallet, 
  Smartphone, 
  IndianRupee, 
  TrendingUp, 
  PieChart as PieIcon 
} from "lucide-react"
import { projectsData, dailyTransactionsData, vouchers, ledgersData, ledgerGroupsData } from "@/lib/mock-data"
import { getLiquidityLedger, LiquidityDay } from "@/lib/profit-loss-utils"
import { useAppStore } from "@/store/use-app-store"
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

// Dummy report data generation
const generateReportData = () => {
  const data = []
  const dates = ["2024-04-10", "2024-04-11", "2024-04-12", "2024-04-13", "2024-04-14"]
  
  for (const date of dates) {
    for (const project of projectsData.filter(p => p.status === "Active")) {
      const cash = 15000 + Math.random() * 50000
      const upi = 10000 + Math.random() * 75000
      const pass = 5000 + Math.random() * 20000
      
      data.push({
        id: `${date}-${project.id}`,
        date,
        projectName: project.name,
        projectId: project.id,
        cash,
        upi,
        pass,
        net: cash + upi + pass
      })
    }
  }
  return data
}

export default function CollectionSummaryReport() {
  const { transactions, vouchers } = useAppStore()
  const [projectFilter, setProjectFilter] = useState("all")
  const [dateFrom, setDateFrom] = useState("2024-04-10")
  const [dateTo, setDateTo] = useState("2024-04-12")
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const liquidityData: LiquidityDay[] = useMemo(() => {
    // In production, opening balance comes from Project/Site Master
    const openingBalance = 500000 
    return getLiquidityLedger(
      dateFrom, 
      dateTo, 
      openingBalance, 
      dailyTransactionsData, 
      vouchers, 
      ledgersData, 
      ledgerGroupsData
    )
  }, [dateFrom, dateTo, vouchers])

  const totals = useMemo(() => {
    return liquidityData.reduce((acc, curr) => ({
      cash: acc.cash + curr.cash,
      upi: acc.upi + curr.upi,
      expense: acc.expense + curr.expense,
      advance: acc.advance + curr.advance,
      pass: acc.pass + (curr.upi * 0.1), // Mocking pass as a portion of UPI
      total: acc.total + curr.collection,
      net: acc.net + curr.finalClosing
    }), { cash: 0, upi: 0, expense: 0, advance: 0, pass: 0, total: 0, net: 0 })
  }, [liquidityData])

  const chartData = useMemo(() => {
    return liquidityData.map(d => ({
       name: d.date.split('-').slice(1).join('/'),
       amount: d.collection
    }))
  }, [liquidityData])

  const typeData = useMemo(() => [
    { name: 'Cash', value: Math.round(totals.cash) },
    { name: 'UPI', value: Math.round(totals.upi) },
    { name: 'Exps', value: Math.round(totals.expense) },
  ], [totals])

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981']

  const handleExport = (type: string) => {
    alert(`Exporting high-resolution ${type} report...`)
  }

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-blue-600">
          <h1 className="text-3xl font-black tracking-tighter decoration-blue-500/30 decoration-4 underline-offset-8">
            Collection Summary Report
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            Consolidated financial performance across date ranges and projects.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleExport("Excel")} className="rounded-xl border-border/40 font-bold gap-2"><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
          <Button variant="outline" onClick={() => handleExport("PDF")} className="rounded-xl border-border/40 font-bold gap-2"><FileText className="h-4 w-4" /> PDF</Button>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <Card className="rounded-[2.5rem] border-blue-500/10 bg-card/20 backdrop-blur-xl shadow-2xl">
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2 px-1">
                <Calendar className="h-3 w-3" /> From Date
              </label>
              <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-12 bg-muted/10 border-border/40 font-bold rounded-2xl" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2 px-1">
                <Calendar className="h-3 w-3" /> To Date
              </label>
              <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-12 bg-muted/10 border-border/40 font-bold rounded-2xl" />
           </div>
           <div className="space-y-2">
             <label className="text-[10px] font-black uppercase text-blue-600 tracking-widest flex items-center gap-2 px-1"><Building2 className="h-3 w-3" /> Filter Project</label>
             <Select value={projectFilter} onValueChange={setProjectFilter}>
               <SelectTrigger className="h-12 bg-muted/10 border-border/40 font-bold rounded-2xl"><SelectValue placeholder="All Projects" /></SelectTrigger>
               <SelectContent className="rounded-2xl border-border/40 backdrop-blur-3xl">
                 <SelectItem value="all" className="h-12 font-bold italic">All Active Projects</SelectItem>
                 {projectsData.map(p => (<SelectItem key={p.id} value={p.id} className="h-12 font-bold">{p.name}</SelectItem>))}
               </SelectContent>
             </Select>
           </div>
           <Button className="h-12 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 font-black gap-2"><Search className="h-4 w-4" /> GENERATE REPORT</Button>
        </CardContent>
      </Card>

      {/* KPI Summary Rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Aggregate Cash", value: totals.cash, icon: <Wallet className="h-5 w-5" />, color: "amber" },
          { label: "Electronic / UPI", value: totals.upi, icon: <Smartphone className="h-5 w-5" />, color: "blue" },
          { label: "Pass Collection", value: totals.pass, icon: <Activity className="h-5 w-5" />, color: "emerald" },
          { label: "Net Grand Total", value: totals.net, icon: <IndianRupee className="h-5 w-5" />, color: "blue" },
        ].map((kpi) => (
          <Card key={kpi.label} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md shadow-xl">
            <CardContent className="p-6 flex items-center justify-between">
               <div><p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">{kpi.label}</p><p className={cn("text-2xl font-black font-mono", `text-${kpi.color}-600`)}>₹{kpi.value.toLocaleString()}</p></div>
               <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center bg-card shadow-inner", `text-${kpi.color}-500/50`)}>{kpi.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Group */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-md">
           <CardHeader><CardTitle className="text-xl font-black flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-500" /> Collection Trend</CardTitle></CardHeader>
           <CardContent className="h-[300px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                  <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip cursor={{ stroke: '#2563eb', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
           </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-md">
           <CardHeader><CardTitle className="text-xl font-black flex items-center gap-2"><PieIcon className="h-5 w-5 text-blue-500" /> Mode Split</CardTitle></CardHeader>
           <CardContent className="h-[300px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                  <RePieChart>
                      <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {typeData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }} />
                  </RePieChart>
                </ResponsiveContainer>
              )}
           </CardContent>
        </Card>
      </div>

      {/* Main Report Table (Mandate 8.1) */}
      <Card className="rounded-[2.5rem] border border-border/40 bg-white/40 backdrop-blur-md shadow-3xl overflow-x-auto mb-12">
        <Table>
          <TableHeader className="bg-muted/40 h-20">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="px-6 font-black uppercase tracking-widest text-[9px]">Date</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px]">Total Coll.</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-blue-600">UPI</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-amber-600">Cash</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-rose-500">Expense</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] italic">Post-Exp Cash</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-purple-600">Advance</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px]">Bal. Cash</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-indigo-600">Banking</TableHead>
              <TableHead className="px-6 text-right font-black uppercase tracking-widest text-[9px] text-primary underline decoration-2">Final Closing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liquidityData.length > 0 ? (
              liquidityData.map((row) => (
                <TableRow key={row.date} className="border-border/40 hover:bg-blue-500/5 transition-colors h-16 group">
                  <TableCell className="px-6 font-mono font-bold text-muted-foreground italic text-[11px]">{row.date}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-foreground">₹{row.collection.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-blue-600/70">₹{row.upi.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-amber-600/70">₹{row.cash.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-rose-500/70">₹{row.expense.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-muted-foreground italic">₹{(row.cash - row.expense).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-purple-600/70">₹{row.advance.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-foreground">₹{(row.cash - row.expense - row.advance).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-indigo-600/70">₹{row.banking.toLocaleString()}</TableCell>
                  <TableCell className="px-6 text-right font-black font-mono text-primary text-sm">₹{row.finalClosing.toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan={10} className="h-64 text-center">No matching data</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
