"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Area, 
  AreaChart, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Line,
  LineChart,
  CartesianGrid
} from "recharts"

interface ChartDataItem {
  name: string
  amount: number
}

interface ChartProps {
  data: ChartDataItem[]
  title: string
  description: string
  type: "collection" | "expense"
}

export function ParkingCharts({ data, title, description, type }: ChartProps) {
  const isCollection = type === "collection"

  return (
    <Card className="border-border/40 bg-card/30 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} debounce={50}>
            {isCollection ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
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
                    color: "hsl(var(--foreground))"
                  }} 
                  itemStyle={{ color: "hsl(var(--primary))" }}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="hsl(var(--primary))" 
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <LineChart data={data}>
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
                    color: "hsl(var(--foreground))"
                  }} 
                  itemStyle={{ color: "hsl(var(--rose-500))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#f43f5e" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: "white" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
