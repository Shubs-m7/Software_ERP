"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  ShieldCheck,
  ChevronRight,
  ParkingCircle,
  Truck,
  ShieldAlert,
  Activity,
  LogOut,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/use-app-store"
import { ProjectSwitcher } from "@/components/project-switcher"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { usePermission } from "@/hooks/use-permission"
import { Module, getModuleFromPath } from "@/lib/rbac"
import { Button } from "@/components/ui/button"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Masters",
      url: "/masters/projects",
      icon: Users,
      items: [
        {
          title: "Project/Site",
          url: "/masters/projects",
        },
        {
          title: "Partners",
          url: "/masters/partners",
        },
        {
          title: "Ledger Groups",
          url: "/masters/ledger-groups",
        },
        {
          title: "Ledgers",
          url: "/masters/ledgers",
        },
        {
          title: "Cost Centres",
          url: "/masters/cost-centres",
        },
        {
          title: "User Management",
          url: "/masters/users",
        },
        {
          title: "Transporters",
          url: "/masters/transporters",
        },
        {
          title: "Guarantees & Deposits",
          url: "/masters/guarantees-deposits",
        },
        {
          title: "Vehicle Types",
          url: "/masters/vehicle-types",
        },
      ],
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: CreditCard,
      items: [
        {
          title: "Daily Entries",
          url: "/transactions/daily-entries",
        },
        {
          title: "Setup Hub",
          url: "/transactions",
        },
        {
          title: "Daily Cash Summary",
          url: "/reports/daily-cash-summary",
        },
        {
          title: "Cash Reconciliation",
          url: "/reports/cash-reconciliation",
        },
        {
          title: "Purchase Entry",
          url: "/transactions/purchase-entry",
        },
        {
          title: "Sales Entry",
          url: "/transactions/sales-entry",
        },
        {
          title: "Receipt Entry",
          url: "/transactions/receipt-entry",
        },
        {
          title: "Payment Entry",
          url: "/transactions/payment-entry",
        },
        {
          title: "Contra Entry",
          url: "/transactions/contra-entry",
        },
        {
          title: "Bank Deposit",
          url: "/transactions/bank-deposit",
        },
        {
          title: "Journal Entry",
          url: "/transactions/journal-entry",
        },
        {
          title: "Partner Advance",
          url: "/transactions/partner-advance",
        },
        {
          title: "Opening Balance",
          url: "/transactions/opening-balance",
        },
        {
          title: "Old Expense",
          url: "/transactions/old-expense",
        },
        {
          title: "Daily Collection",
          url: "/transactions/daily-collection",
          mode: "PARKING"
        },
        {
          title: "Detailed Register",
          url: "/transactions/detailed-register",
          mode: "BALU"
        },
        {
          title: "Balu Dispatch",
          url: "/transactions/balu-dispatch",
          mode: "BALU"
        },
        {
          title: "Expense Entry",
          url: "/transactions/expense-entry",
        },
        {
          title: "Parking Entry",
          url: "/transactions/parking-entry",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: BarChart3,
      items: [
        {
          title: "Intelligence Hub",
          url: "/reports",
        },
        {
          title: "Collection Summary",
          url: "/reports/collection-summary",
        },
        {
          title: "Parking Log",
          url: "/reports/parking-log",
        },
        {
          title: "Dispatch Summary",
          url: "/reports/dispatch-summary",
          mode: "BALU"
        },
        {
          title: "Truck Log",
          url: "/reports/vehicle-log",
          mode: "BALU"
        },
        {
          title: "Expense Statement",
          url: "/reports/expense-statement",
        },
        {
          title: "Ledger Summary",
          url: "/reports/ledger-summary",
        },
      ],
    },
    {
      title: "Administration",
      url: "/administration",
      icon: ShieldAlert,
      items: [
        {
          title: "Change Requests",
          url: "/administration/change-requests",
        },
        {
          title: "Role & Permissions",
          url: "/administration/roles",
        },
        {
          title: "Global Settings",
          url: "/administration/settings",
        },
        {
          title: "Audit Logs",
          url: "/administration/audit-logs",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { businessType, roles } = useAppStore()
  const { user, logout } = useAuth()
  const { canView } = usePermission()
  const pathname = usePathname()

  const userRoleName = roles.find(r => r.id === user?.roleId)?.name || "GUEST"
  const isSuperAdmin = user?.roleId === "r1"
  const isSiteManager = user?.roleId === "r2"

  const filteredNav = data.navMain
    .filter(item => {
      // Basic RBAC Check
      const moduleKey = item.title.toLowerCase() as Module
      if (!canView(moduleKey)) return false

      // Site Managers and Restricted Users filtered view
      if (isSiteManager && item.title === "Administration") {
         // Only Super Admin should see the full Admin menu usually, but checkPermission handles it
         return true 
      }
      
      return true
    })
    .map(item => {
      let filteredItems = item.items?.filter(subItem => {
        const subModule = getModuleFromPath(subItem.url)
        return !subModule || canView(subModule)
      })

      // Role Specific Item Filters
      if (isSiteManager) {
        if (item.title === "Masters") {
          filteredItems = filteredItems?.filter(si => 
            si.title === "Ledgers" || si.title === "Transporters" || si.title === "Vehicle Types"
          )
        }
      }

      return {
        ...item,
        items: filteredItems
      }
    })
    .filter(item => !item.items || item.items.length > 0 || item.url === "/dashboard")

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/40 bg-sidebar">
      <SidebarHeader className="h-28 flex flex-col justify-center px-4 gap-6 border-b border-border/20">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_8px_16px_-4px_rgba(var(--primary),0.3)] transition-transform hover:rotate-6">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
            <span className="font-black text-base text-foreground tracking-tight">ERP Enterprise</span>
            <span className="text-[10px] uppercase font-black text-primary tracking-[0.15em]">Software V2</span>
          </div>
        </div>
        <div className="group-data-[collapsible=icon]:hidden">
          <ProjectSwitcher />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {filteredNav.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive || pathname.startsWith(item.url)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    className={cn(
                      "h-11 transition-all",
                      pathname === item.url ? (
                        businessType === "PARKING" ? "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20" :
                        businessType === "BALU" ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" :
                        "bg-primary/10 text-primary hover:bg-primary/20"
                      ) : "hover:bg-accent/50"
                    )}
                  >
                    {item.icon && (
                      <item.icon className={cn(
                        "h-4 w-4",
                        pathname === item.url && (
                          businessType === "PARKING" ? "text-blue-600" :
                          businessType === "BALU" ? "text-amber-600" :
                          "text-primary"
                        )
                      )} />
                    )}
                    <span className={cn(
                       "text-[11px] uppercase tracking-widest",
                      pathname === item.url ? "font-black" : "font-black opacity-60"
                    )}>
                      {item.title}
                    </span>
                    {item.items && (
                      <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    )}
                  </SidebarMenuButton>
                 </CollapsibleTrigger>
                {item.items && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem: any) => {
                        const isModeMismatch = subItem.mode && businessType && subItem.mode !== businessType
                        
                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton 
                              asChild 
                              className={cn(
                                "h-10 hover:bg-black/5 dark:hover:bg-white/5 transition-all px-4 rounded-lg",
                                isModeMismatch && "opacity-30 grayscale pointer-events-none",
                                pathname === subItem.url && (
                                  businessType === "PARKING" ? "bg-blue-500/10 border-r-2 border-blue-600" :
                                  businessType === "BALU" ? "bg-amber-500/10 border-r-2 border-amber-500" :
                                  "bg-primary/10 border-r-2 border-primary"
                                )
                              )}
                            >
                              <a href={subItem.url}>
                                <span className={cn(
                                  "text-[10px] font-bold uppercase tracking-tight transition-colors",
                                  pathname === subItem.url ? (
                                    businessType === "PARKING" ? "text-blue-600 font-black" :
                                    businessType === "BALU" ? "text-amber-600 font-black" :
                                    "text-primary font-black"
                                  ) : "text-muted-foreground hover:text-foreground"
                                )}>
                                  {subItem.title}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 gap-4">
        <div className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-xl shadow-xl p-4 group-data-[collapsible=icon]:hidden">
           <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                 <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                 <span className="text-xs font-black italic tracking-tighter truncate max-w-[120px]">{user?.name}</span>
                 <span className="text-[9px] font-black uppercase text-primary tracking-widest">{userRoleName}</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">
                 <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                 Sovereign Active
              </div>
              <Button 
                 variant="ghost" 
                 size="icon" 
                 onClick={logout}
                 className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 ml-auto transition-all"
                 title="Logout"
              >
                 <LogOut className="h-4 w-4" />
              </Button>
           </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
