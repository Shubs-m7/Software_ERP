import React from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"

interface MasterTableShellProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  totalCount: number
  children: React.ReactNode
  onResetSearch?: () => void
}

export function MasterTableShell({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search...",
  totalCount,
  children,
  onResetSearch
}: MasterTableShellProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Stats/Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={searchPlaceholder}
            className="pl-11 h-12 bg-card/30 border-border/40 focus:border-primary/50 rounded-2xl transition-all font-medium"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 w-full border-border/40 bg-card/30 rounded-2xl flex items-center gap-2 hover:bg-accent/40 font-bold transition-all">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <div className="h-12 w-28 flex items-center justify-center bg-primary/10 border border-primary/20 rounded-2xl shadow-inner">
            <span className="text-primary font-black text-xl">{totalCount}</span>
            <span className="text-[9px] text-primary/60 uppercase ml-1.5 font-black tracking-tighter">Total</span>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-[2.5rem] border border-border/40 bg-card/10 backdrop-blur-md overflow-hidden shadow-2xl min-h-[400px] flex flex-col">
        {totalCount > 0 ? (
          children
        ) : (
          <EmptyState 
            title="No records found"
            description={searchQuery ? `We couldn't find any results matching "${searchQuery}"` : "Starting adding records to see them appear in this registry."}
            action={searchQuery ? { label: "Clear Search", onClick: () => onResetSearch?.() } : undefined}
          />
        )}
      </div>
    </div>
  )
}
