"use client"

import React, { useState, useMemo } from "react"
import { usersData } from "@/lib/mock-data"
import { User, UserRole } from "@/types/user"
import { UserForm } from "@/components/masters/user-form"
import { useAppStore } from "@/store/use-app-store"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldAlert, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MoreHorizontal,
  Edit2,
  Power,
  Search,
  CheckCircle2,
  XCircle,
  Activity
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function UserManagementPage() {
  const { roles } = useAppStore()
  const [users, setUsers] = useState<User[]>(usersData)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.includes(searchQuery)
    )
  }, [users, searchQuery])

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      privileged: users.filter(u => {
        const role = roles.find(r => r.id === u.roleId)
        return role?.name === "Super Admin" || role?.name === "Admin"
      }).length
    }
  }, [users, roles])

  const handleCreateUser = (data: any) => {
    const newUser: User = {
      ...data,
      id: `u-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    }
    setUsers(prev => [newUser, ...prev])
  }

  const handleUpdateUser = (data: any) => {
    if (!selectedUser) return
    setUsers(prev => prev.map(u => 
      u.id === selectedUser.id ? { ...u, ...data } : u
    ))
    setSelectedUser(null)
  }

  const toggleStatus = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ))
  }

  const getRoleName = (roleId: string) => {
    return roles.find(r => r.id === roleId)?.name || "GUEST"
  }

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-5 duration-1000 pb-20 px-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-foreground flex items-center gap-3 italic">
             <Users className="h-10 w-10 text-primary" />
             Personnel <span className="text-primary">Governance</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2 italic">
             <Activity className="h-4 w-4 text-primary" /> Multi-site identity mapping and RBAC synchronization.
          </p>
        </div>

        <Button 
           onClick={() => { setSelectedUser(null); setIsFormOpen(true); }}
           className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-black shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 italic tracking-tighter"
        >
           <UserPlus className="h-6 w-6" />
           ONBOARD IDENTITY
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { label: "Governed Identities", value: stats.total, icon: <Users className="h-6 w-6" />, color: "primary" },
           { label: "Active Access Nodes", value: stats.active, icon: <CheckCircle2 className="h-6 w-6" />, color: "emerald" },
           { label: "Privileged Nodes", value: stats.privileged, icon: <ShieldCheck className="h-6 w-6" />, color: "amber" },
         ].map((stat) => (
           <Card key={stat.label} className={cn(
             "rounded-[2.5rem] border-border/40 bg-card/10 backdrop-blur-xl shadow-xl overflow-hidden group",
             "hover:scale-[1.02] transition-all cursor-default"
           )}>
              <CardContent className="p-8 flex items-center justify-between">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest leading-none mb-1">{stat.label}</p>
                    <p className="text-4xl font-black font-mono tracking-tighter italic">
                       {stat.value.toString().padStart(2, '0')}
                    </p>
                 </div>
                 <div className={cn(
                   "h-14 w-14 rounded-2xl bg-muted/20 flex items-center justify-center transition-all",
                   stat.color === "emerald" ? "text-emerald-500 bg-emerald-500/10" : 
                   stat.color === "amber" ? "text-amber-500 bg-amber-500/10" : 
                   "text-primary bg-primary/10"
                 )}>
                    {stat.icon}
                 </div>
              </CardContent>
           </Card>
         ))}
      </div>

      {/* User Table Header/Filter */}
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
            <div className="relative w-full md:w-[450px]">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="Search identities by name, email or mobile..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="h-14 pl-12 rounded-2xl bg-muted/10 border-border/40 focus:bg-background transition-all font-bold placeholder:font-medium"
               />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
               <Activity className="h-3 w-3 text-emerald-500 animate-pulse" />
               Live Sovereignty Engine Active
            </div>
         </div>

         <div className="rounded-[3rem] border border-border/40 bg-card/10 backdrop-blur-3xl shadow-3xl overflow-hidden mb-12">
            <Table>
               <TableHeader className="bg-muted/30 h-20">
                  <TableRow className="border-border/40">
                     <TableHead className="px-10 font-black uppercase tracking-widest text-[9px] text-foreground">Sovereign Identity</TableHead>
                     <TableHead className="font-black uppercase tracking-widest text-[9px] text-foreground">Governance Rank</TableHead>
                     <TableHead className="font-black uppercase tracking-widest text-[9px] text-foreground">Contact Node</TableHead>
                     <TableHead className="font-black uppercase tracking-widest text-[9px] text-center text-foreground">Operational Status</TableHead>
                     <TableHead className="px-10 text-right font-black uppercase tracking-widest text-[9px] text-foreground">Orchestration</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {filteredUsers.map((u) => (
                     <TableRow key={u.id} className="border-border/40 hover:bg-muted/10 transition-colors h-24 group">
                        <TableCell className="px-10">
                           <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 rounded-2xl border border-border/40 shadow-inner">
                                 <AvatarFallback className="bg-primary/5 text-primary text-xs font-black italic">
                                    {u.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                 <span className="font-black text-foreground italic tracking-tight">{u.name}</span>
                                 <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">ID: {u.id}</span>
                              </div>
                           </div>
                        </TableCell>
                        <TableCell>
                           <Badge className={cn(
                              "rounded-lg px-3 py-1 font-black text-[9px] uppercase tracking-widest border shadow-none italic",
                              getRoleName(u.roleId).includes("Admin") ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                              "bg-primary/5 text-primary border-primary/20"
                           )}>
                              {getRoleName(u.roleId).includes("Admin") && <ShieldCheck className="h-3 w-3 mr-1.5 inline" />}
                              {!getRoleName(u.roleId).includes("Admin") && <Shield className="h-3 w-3 mr-1.5 inline" />}
                              {getRoleName(u.roleId)}
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-[11px] font-bold text-foreground">
                                 <Mail className="h-3 w-3 text-primary opacity-50" />
                                 {u.email}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground tracking-tighter italic">
                                 <Phone className="h-3 w-3 opacity-50" />
                                 {u.mobile}
                              </div>
                           </div>
                        </TableCell>
                        <TableCell className="text-center">
                           <div className={cn(
                              "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-inner",
                              u.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                           )}>
                              <div className={cn(
                                 "h-1.5 w-1.5 rounded-full",
                                 u.isActive ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                              )} />
                              {u.isActive ? "ACTIVE NODE" : "ACCESS REVOKED"}
                           </div>
                        </TableCell>
                        <TableCell className="px-10 text-right">
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                 <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary/10 transition-all">
                                    <MoreHorizontal className="h-5 w-5" />
                                 </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-[2rem] border-border/40 backdrop-blur-3xl shadow-3xl p-2">
                                 <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-4 py-3 opacity-50">Identity Controls</DropdownMenuLabel>
                                 <DropdownMenuSeparator className="bg-border/20 mb-1" />
                                 <DropdownMenuItem 
                                    className="h-12 px-4 rounded-xl font-bold flex items-center gap-3 focus:bg-primary/10 focus:text-primary cursor-pointer transition-all italic text-sm"
                                    onClick={() => { setSelectedUser(u); setIsFormOpen(true); }}
                                 >
                                    <Edit2 className="h-4 w-4" />
                                    Modify Profile
                                 </DropdownMenuItem>
                                 <DropdownMenuItem 
                                    className={cn(
                                       "h-12 px-4 rounded-xl font-bold flex items-center gap-3 cursor-pointer transition-all italic text-sm",
                                       u.isActive ? "focus:bg-rose-500/10 focus:text-rose-500" : "focus:bg-emerald-500/10 focus:text-emerald-500"
                                    )}
                                    onClick={() => toggleStatus(u.id)}
                                 >
                                    <Power className="h-4 w-4" />
                                    {u.isActive ? "Decommission" : "Re-Initialize"}
                                 </DropdownMenuItem>
                                 <DropdownMenuSeparator className="bg-border/20 mt-1" />
                                 <DropdownMenuItem className="h-12 px-4 rounded-xl font-black uppercase text-[10px] tracking-widest text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 cursor-pointer transition-all">
                                    <ShieldAlert className="h-4 w-4" />
                                    Purge Credentials
                                 </DropdownMenuItem>
                              </DropdownMenuContent>
                           </DropdownMenu>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>

      <UserForm 
         isOpen={isFormOpen}
         onClose={() => setIsFormOpen(false)}
         initialData={selectedUser}
         onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
      />
    </div>
  )
}
