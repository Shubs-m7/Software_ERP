"use client"

import * as React from "react"
import { 
  Bell, 
  Settings, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileEdit,
  ArrowRight
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAppStore } from "@/store/use-app-store"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function NotificationCenter() {
  const { changeRequests } = useAppStore()
  
  // Only show "Pending" count for the badge
  const pendingCount = changeRequests.filter(r => r.status === "PENDING").length
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative text-muted-foreground hover:text-primary transition-colors"
        >
          <Bell className="h-5 w-5" />
          {pendingCount > 0 && (
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-rose-500 border-2 border-background animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 rounded-3xl border-border/40 bg-card/50 backdrop-blur-3xl shadow-2xl overflow-hidden" align="end">
        <div className="p-4 border-b border-border/20 bg-muted/30">
          <div className="flex items-center justify-between font-black uppercase text-[10px] tracking-widest text-muted-foreground">
             <span className="flex items-center gap-2">
               <AlertCircle className="h-3 w-3 text-primary" />
               Recent Activity
             </span>
             {pendingCount > 0 && <span className="text-primary">{pendingCount} Action Needed</span>}
          </div>
        </div>

        <ScrollArea className="h-[350px]">
          {changeRequests.length > 0 ? (
            <div className="flex flex-col">
              {changeRequests.map((request, i) => (
                <div key={request.id}>
                  <Link 
                    href="/administration/change-requests"
                    className="flex flex-col gap-2 p-4 hover:bg-primary/5 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          request.status === "PENDING" ? "bg-amber-500/10 text-amber-500" :
                          request.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-500" :
                          "bg-rose-500/10 text-rose-500"
                        )}>
                          <FileEdit className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                            Transaction Edit
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground">
                            {request.entryType} #{request.entryId}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-black uppercase tracking-tighter px-2",
                        request.status === "PENDING" ? "border-amber-500/50 text-amber-600 bg-amber-50/50" :
                        request.status === "APPROVED" ? "border-emerald-500/50 text-emerald-600 bg-emerald-50/50" :
                        "border-rose-500/50 text-rose-600 bg-rose-50/50"
                      )}>
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-[10px] font-medium text-muted-foreground line-clamp-2 italic leading-relaxed">
                      "{request.reason}"
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] font-bold text-muted-foreground/40 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Just now
                      </span>
                      <ArrowRight className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                  {i < changeRequests.length - 1 && <Separator className="bg-border/20" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
               <div className="h-12 w-12 rounded-full bg-muted/20 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-muted-foreground/40" />
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-black text-foreground opacity-60 uppercase tracking-tighter">All Clear!</p>
                 <p className="text-[10px] text-muted-foreground font-medium italic">No pending notifications at this time.</p>
               </div>
            </div>
          )}
        </ScrollArea>
        
        <div className="p-3 border-t border-border/20 bg-muted/30">
          <Button 
            asChild
            variant="ghost" 
            className="w-full h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 rounded-xl"
          >
            <Link href="/administration/change-requests">
              View All Change Requests
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
