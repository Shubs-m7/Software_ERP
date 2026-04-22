import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, Truck, FileText, HandCoins, AlertCircle, TrendingUp } from "lucide-react"

const icons = {
  "total dispatch": Truck,
  "total billing": FileText,
  "cash received": HandCoins,
  "outstanding": AlertCircle,
  "net profit": TrendingUp,
}

interface StatsCardProps {
  title: string
  value: string
  unit?: string
  change: string
  trend: "up" | "down"
}

export function BaluStatsCard({ title, value, unit, change, trend }: StatsCardProps) {
  const Icon = icons[title.toLowerCase() as keyof typeof icons] || FileText
  const isPositive = trend === "up"

  return (
    <Card className="relative overflow-hidden border-border/40 bg-card hover:shadow-md transition-shadow duration-300">
      {/* Left accent border */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
        title.toLowerCase() === "net profit" ? "bg-emerald-500" : 
        title.toLowerCase() === "outstanding" ? "bg-rose-500" : "bg-violet-500"
      }`} />
      
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            title.toLowerCase() === "net profit" ? "bg-emerald-500/10 text-emerald-600" : 
            title.toLowerCase() === "outstanding" ? "bg-rose-500/10 text-rose-600" : "bg-violet-500/10 text-violet-600"
          }`}>
            <Icon className="h-6 w-6" />
          </div>
          
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold tracking-tight">{value}</span>
              {unit && <span className="text-xs font-medium text-muted-foreground">{unit}</span>}
            </div>
            
            <div className="flex items-center gap-1.5 pt-1">
              <div className={`flex items-center gap-0.5 text-xs font-bold ${
                isPositive ? "text-emerald-600" : "text-rose-600"
              }`}>
                {isPositive ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
                {change}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">vs last month</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
