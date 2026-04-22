import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, Wallet, Receipt, Coins } from "lucide-react"

const icons = {
  "total collection": CreditCard,
  "cash": DollarSign,
  "upi": Wallet,
  "expenses": Receipt,
  "cash in hand": Coins,
}

interface StatsCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
}

export function StatsCard({ title, value, change, trend }: StatsCardProps) {
  const Icon = icons[title.toLowerCase() as keyof typeof icons] || DollarSign

  return (
    <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          <div className={`flex items-center gap-0.5 text-xs font-medium ${
            trend === "up" ? "text-emerald-500" : "text-rose-500"
          }`}>
            {trend === "up" ? <ArrowUpIcon className="h-3 w-3" /> : <ArrowDownIcon className="h-3 w-3" />}
            {change}
          </div>
          <span className="text-[10px] text-muted-foreground">vs last week</span>
        </div>
      </CardContent>
    </Card>
  )
}
