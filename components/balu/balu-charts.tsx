"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Area,
  AreaChart
} from "recharts"

interface DispatchData {
  name: string
  tons: number
}

interface FinancialData {
  name: string
  billing: number
  collection: number
}

export function DispatchTrendChart({ data }: { data: DispatchData[] }) {
  return (
    <Card className="border-border/40 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Dispatch Trend</CardTitle>
        <CardDescription>Daily dispatch quantity in tons over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value}t`}
              />
              <Tooltip 
                cursor={{ fill: "hsl(var(--muted)/0.4)" }}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Bar 
                dataKey="tons" 
                radius={[4, 4, 0, 0]} 
                fill="hsl(var(--violet-500))"
                className="fill-violet-500"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === data.length - 1 ? "#8b5cf6" : "#c4b5fd"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function BillingVsCollectionChart({ data }: { data: FinancialData[] }) {
  return (
    <Card className="border-border/40 bg-card shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Billing vs Collection</CardTitle>
        <CardDescription>Comparison of invoiced amounts and cash received</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBilling" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCollection" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                }}
              />
              <Legend verticalAlign="top" height={36}/>
              <Area 
                type="monotone" 
                dataKey="billing" 
                name="Billing"
                stroke="#6366f1" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBilling)" 
              />
              <Area 
                type="monotone" 
                dataKey="collection" 
                name="Collection"
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorCollection)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
