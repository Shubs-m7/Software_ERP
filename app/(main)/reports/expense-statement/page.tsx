"use client"

import React, { useState, useMemo } from "react"
import { 
  Calendar, 
  Building2, 
  IndianRupee, 
  Search, 
  Filter, 
  PieChart as PieIcon, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  FileDown,
  CreditCard,
  Wallet,
  Receipt,
  Settings,
  ArrowRight
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

// Dummy Expense Data Generation
const generateExpenseData = () => {
  const data = []
  const categories = ["Fuel", "Salaries", "Maintenance", "Site Supplies", "Electricity", "Royalties"]
  const dates = ["2024-04-10", "2024-04-11", "2024-04-12", "2024-04-13", "2024-04-14"]
  const modes = ["Bank Transfer", "Cash", "UPI", "Cheque"]
  
  for (const date of dates) {
    for (const project of projectsData.filter(p => p.status === "Active")) {
      const dailyExpensesCount = 2 + Math.floor(Math.random() * 3)
      for (let i = 0; i < dailyExpensesCount; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)]
        const amount = 5000 + Math.random() * 45000
        data.push({
          id: `exp-${date}-${project.id}-${i}`,
          date,
          category,
          projectName: project.name,
          projectId: project.id,
          amount,
          paymentMode: modes[Math.floor(Math.random() * modes.length)],
          details: `${category} payment for project ${project.name}`
        })
      }
    }
  }
  return data.sort((a, b) => b.date.localeCompare(a.date))
}

const trendData = [
  { name: 'Jan', amount: 450000 },
  { name: 'Feb', amount: 520000 },
  { name: 'Mar', amount: 480000 },
  { name: 'Apr', amount: 310000 }, // Partial month
]

export default function ExpenseStatementPage() {
  const [expenses] = useState(generateExpenseData())
  const [projectFilter, setProjectFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [mounted, setMounted] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const matchProject = projectFilter === "all" || exp.projectId === projectFilter
      const matchCategory = categoryFilter === "all" || exp.category === categoryFilter
      return matchProject && matchCategory
    })
  }, [projectFilter, categoryFilter, expenses])

  const totals = useMemo(() => {
    const total = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0)
    
    // Categorical breakdown
    const catMap = new Map()
    filteredExpenses.forEach(exp => {
      catMap.set(exp.category, (catMap.get(exp.category) || 0) + exp.amount)
    })
    
    const catData = Array.from(catMap.entries())
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)

    return { total, catData }
  }, [filteredExpenses])

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#6366f1']

  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <Receipt className="h-3 w-3" />
             Financial Statements
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            Expense <span className="text-amber-500 italic">Statement</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-amber-500" />
            Comprehensive project-wise expenditure and cost analysis.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-2xl border-border/40 bg-card/50 backdrop-blur-md hover:bg-amber-500/10 hover:text-amber-600 transition-all font-bold gap-2 h-12 px-6">
            <FileDown className="h-4 w-4" />
            Download PDF
          </Button>
          <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 font-black gap-2 h-12 px-8 shadow-xl shadow-amber-500/20 transition-all">
            <Settings className="h-4 w-4" />
            Account Config
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="rounded-[2.5rem] border-amber-500/10 bg-gradient-to-br from-amber-500/5 via-background to-background backdrop-blur-3xl shadow-3xl overflow-hidden">
        <CardContent className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
           <div className="space-y-2 text-amber-600">
             <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1">
               <Building2 className="h-3 w-3" /> Select Project
             </label>
             <Select value={projectFilter} onValueChange={setProjectFilter}>
               <SelectTrigger className="h-14 bg-white/50 border-border/40 rounded-2xl font-bold">
                 <SelectValue placeholder="All Sites" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl">
                 <SelectItem value="all" className="font-bold">Consolidated (All Projects)</SelectItem>
                 {projectsData.map(p => (
                   <SelectItem key={p.id} value={p.id} className="font-bold">{p.name}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <div className="space-y-2 text-amber-600">
             <label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1">
               <Receipt className="h-3 w-3" /> Expense Category
             </label>
             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
               <SelectTrigger className="h-14 bg-white/50 border-border/40 rounded-2xl font-bold">
                 <SelectValue placeholder="All Categories" />
               </SelectTrigger>
               <SelectContent className="rounded-2xl">
                 <SelectItem value="all" className="font-bold italic">All Expenditure Types</SelectItem>
                 {Array.from(new Set(expenses.map(e => e.category))).map(cat => (
                   <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>

           <Button className="h-14 w-full rounded-2xl bg-foreground text-background font-black shadow-xl flex items-center gap-3 hover:scale-[1.02] transition-all">
             <Search className="h-5 w-5" />
             FILTER FINANCIALS
           </Button>
        </CardContent>
      </Card>

      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Spent", value: `₹${(totals.total / 100000).toFixed(2)}L`, icon: <Wallet className="h-5 w-5" />, color: "amber", trend: "+4.2%", up: true },
          { label: "Transactions", value: filteredExpenses.length, icon: <Activity className="h-5 w-5" />, color: "orange", trend: "-1.5%", up: false },
          { label: "Top Project", value: "Parking Site A", icon: <Building2 className="h-5 w-5" />, color: "slate", sub: "62% of Spend" },
          { label: "Avg Ticket", value: `₹${Math.round(totals.total / filteredExpenses.length).toLocaleString()}`, icon: <CreditCard className="h-5 w-5" />, color: "emerald", sub: "Per voucher" },
        ].map((kpi) => (
          <Card key={kpi.label} className="rounded-3xl border-border/40 bg-card/10 backdrop-blur-md shadow-xl overflow-hidden relative group">
             <div className={cn("absolute top-0 right-0 h-2 w-full", `bg-${kpi.color}-500/20`)} />
             <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center bg-white shadow-inner", `text-${kpi.color}-500`)}>
                    {kpi.icon}
                  </div>
                  {kpi.trend && (
                    <div className={cn("flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full", kpi.up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")}>
                      {kpi.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {kpi.trend}
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{kpi.label}</p>
                <p className="text-3xl font-black tracking-tighter text-foreground">{kpi.value}</p>
             </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-md">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <PieIcon className="h-5 w-5 text-amber-500" />
                 Spend Distribution
              </CardTitle>
              <CardDescription>Expenditure split by operational categories</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                   <RePieChart>
                      <Pie
                        data={totals.catData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {totals.catData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        formatter={(v) => `₹${Number(v).toLocaleString()}`}
                      />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase' }} />
                   </RePieChart>
                </ResponsiveContainer>
              )}
           </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 bg-card/20 backdrop-blur-md">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <TrendingUp className="h-5 w-5 text-amber-500" />
                 Cash Flow Trend
              </CardTitle>
              <CardDescription>Monthly outflow trajectory for the current FY</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px]">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
                   <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="amberGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} stroke="#888" />
                      <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="#888" tickFormatter={(v) => `₹${v/1000}k`} />
                      <Tooltip cursor={{ stroke: '#f59e0b', strokeWidth: 2 }} />
                      <Area type="monotone" dataKey="amount" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#amberGradient)" />
                   </AreaChart>
                </ResponsiveContainer>
              )}
           </CardContent>
        </Card>
      </div>

      {/* Ledger Table */}
      <Card className="rounded-[2.5rem] border border-border/40 bg-white/40 backdrop-blur-xl shadow-3xl overflow-hidden mb-12">
        <div className="p-8 border-b border-border/40 flex items-center justify-between bg-card/30">
           <div>
              <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                 <Receipt className="h-5 w-5 text-amber-500" />
                 Detailed Expense Ledger
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Transaction-level financial audit trail</p>
           </div>
           <Badge className="rounded-full bg-amber-500/10 text-amber-600 font-black border-amber-500/20 px-4 py-1">
              FY 2024-25
           </Badge>
        </div>
        <Table>
          <TableHeader className="bg-muted/40 h-16">
            <TableRow className="border-border/40 hover:bg-transparent">
              <TableHead className="px-8 font-black uppercase tracking-widest text-[9px]">Voucher Date</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[9px]">Category</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[9px]">Project Site</TableHead>
              <TableHead className="font-black uppercase tracking-widest text-[9px]">Payment Mode</TableHead>
              <TableHead className="text-right font-black uppercase tracking-widest text-[9px] text-amber-600 px-8">Debit Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.map((exp) => (
              <TableRow key={exp.id} className="border-border/40 hover:bg-amber-500/5 transition-colors h-16 group">
                <TableCell className="px-8 font-mono font-bold text-muted-foreground group-hover:text-amber-600 transition-colors">{exp.date}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                     <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                     <span className="font-black text-foreground uppercase text-[11px]">{exp.category}</span>
                  </div>
                </TableCell>
                <TableCell className="font-bold text-muted-foreground">{exp.projectName}</TableCell>
                <TableCell>
                   <Badge variant="outline" className="rounded-xl font-bold text-[9px] px-3 py-0.5 border-border/60">
                      {exp.paymentMode === "Bank Transfer" ? <ArrowRight className="h-2.5 w-2.5 mr-1" /> : <Wallet className="h-2.5 w-2.5 mr-1" />}
                      {exp.paymentMode}
                   </Badge>
                </TableCell>
                <TableCell className="px-8 text-right font-mono font-black text-amber-600">
                  ₹{exp.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot className="bg-amber-500/5 border-t border-border/40">
             <TableRow className="h-20 hover:bg-transparent">
                <TableCell colSpan={4} className="px-8 text-sm font-black uppercase tracking-widest text-amber-700">AGGREGATE EXPENDITURE Total</TableCell>
                <TableCell className="px-8 text-right font-mono font-black text-3xl text-amber-600">
                   ₹{totals.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </TableCell>
             </TableRow>
          </tfoot>
        </Table>
      </Card>

    </div>
  )
}
