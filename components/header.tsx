"use client"

import React from "react"
import { Search, Bell, User, LayoutGrid, Sun, Moon } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useAuth } from "@/context/AuthContext"
import { ProjectSelector } from "@/components/project-selector"
import { NotificationCenter } from "@/components/notification-center"
import { useAppStore } from "@/store/use-app-store"
import { usePathname } from "next/navigation"

export function Header() {
  const { user, logout } = useAuth()
  const { roles } = useAppStore()
  const pathname = usePathname()

  const roleName = roles.find(r => r.id === user?.roleId)?.name || "Personnel"

  // Dynamic Breadcrumb Logic
  const segments = pathname.split('/').filter(Boolean)
  const prettySegments = segments.map(s => 
    s.split('-')
     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
     .join(' ')
  )
  
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-4 border-b border-border/40 backdrop-blur-md bg-transparent sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard" className="font-bold uppercase text-[10px] tracking-widest opacity-50">Enterprise</BreadcrumbLink>
            </BreadcrumbItem>
            
            {prettySegments.length > 0 ? (
              prettySegments.map((pretty, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    {index === prettySegments.length - 1 ? (
                      <BreadcrumbPage className="font-black italic tracking-tighter text-foreground">{pretty}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        href={`/${segments.slice(0, index + 1).join('/')}`} 
                        className="font-bold uppercase text-[10px] tracking-widest opacity-50"
                      >
                        {pretty}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))
            ) : (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                   <BreadcrumbPage className="font-black italic tracking-tighter text-foreground">Sovereign Deck</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        <ProjectSelector />
        <div className="hidden lg:flex items-center relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -track-y-1/2 h-3.5 w-3.5 text-muted-foreground opacity-50" />
          <Input
            type="search"
            placeholder="Query Registry..."
            className="pl-9 h-10 w-[300px] lg:w-[400px] bg-muted/10 border-border/40 rounded-xl focus:bg-background transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <NotificationCenter />
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all">
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6 opacity-20" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-11 w-11 rounded-2xl p-0 hover:scale-105 transition-all">
              <Avatar className="h-11 w-11 border-2 border-border/40 rounded-2xl shadow-lg">
                <AvatarFallback className="bg-primary/5 text-primary uppercase font-black italic rounded-2xl">
                  {user?.name?.[0] || "U"}{user?.name?.[1] || ""}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 rounded-[2rem] border-border/40 backdrop-blur-3xl shadow-3xl p-2 mt-2" align="end" forceMount>
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-black italic tracking-tight">{user?.name || "Unidentified Personnel"}</p>
                <div className="flex items-center gap-2">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[10px] font-black uppercase text-primary tracking-widest">
                     {roleName}
                   </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/20 mx-2" />
            <DropdownMenuItem className="h-12 px-4 rounded-xl font-bold italic text-sm cursor-pointer focus:bg-primary/10 focus:text-primary transition-all">
              Governance Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="h-12 px-4 rounded-xl font-bold italic text-sm cursor-pointer focus:bg-primary/10 focus:text-primary transition-all">
              System Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/20 mx-2" />
            <DropdownMenuItem 
              className="h-12 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-rose-500 cursor-pointer focus:bg-rose-500/10 focus:text-rose-500 transition-all"
              onClick={() => logout()}
            >
              Terminate Session
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
