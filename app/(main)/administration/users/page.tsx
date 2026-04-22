"use client"

import React, { useState, useMemo } from "react"
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  Building2, 
  Mail, 
  Phone,
  Shield,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Filter,
  Lock,
  Edit3
} from "lucide-react"
import { useAppStore } from "@/store/use-app-store"
import { User } from "@/types/user"
import { projectsData, roles } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function UserMasterPage() {
  const { users } = useAppStore()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = useMemo(() => {
    return users.filter((u: User) => 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-1000 pb-20">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-tighter w-fit mb-2">
             <ShieldCheck className="h-3 w-3" />
             Identity Governance
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground italic">
            User <span className="text-indigo-600 italic">Sovereignty Hub</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Lock className="h-4 w-4 text-indigo-600" />
            Control enterprise identities, site mappings, and role permissions.
          </p>
        </div>
        
        <Button 
          onClick={() => setIsAddOpen(true)}
          className="h-14 px-8 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all gap-3"
        >
          <UserPlus className="h-5 w-5" /> ONBOARD NEW USER
        </Button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="rounded-[2.2rem] border-indigo-500/10 bg-indigo-500/5 backdrop-blur-xl">
            <CardContent className="p-6">
               <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest leading-none mb-3">Total Identities</p>
               <p className="text-3xl font-black italic">{users.length}</p>
            </CardContent>
         </Card>
      </div>

      {/* Control Bar */}
      <Card className="rounded-[2.5rem] border border-border/40 bg-card/10 backdrop-blur-3xl p-6">
         <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <Input 
                 placeholder="Search by name, email or mobile..."
                 className="h-14 pl-14 rounded-2xl bg-background/50 border-border/40 font-bold"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <Button variant="outline" className="h-14 px-8 rounded-2xl border-border/40 font-bold gap-2">
               <Filter className="h-5 w-5" /> Filter Roles
            </Button>
         </div>
      </Card>

      {/* User Table (Mandate 7.15) */}
      <Card className="rounded-[3rem] border border-border/40 bg-card/20 backdrop-blur-md overflow-hidden shadow-2xl">
         <Table>
            <TableHeader className="bg-muted/30">
               <TableRow className="border-border/40 h-20">
                  <TableHead className="px-10 font-black text-[9px] uppercase tracking-widest">Enterprise User</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-center">Assigned Role</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest">Site Access (Multi-Site)</TableHead>
                  <TableHead className="font-black text-[9px] uppercase tracking-widest text-center">Integrity Status</TableHead>
                  <TableHead className="px-10 text-right font-black text-[9px] uppercase tracking-widest">Actions</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {filteredUsers.map((user: User) => (
                  <TableRow key={user.id} className="border-border/10 hover:bg-indigo-500/5 transition-all h-20 group">
                     <TableCell className="px-10">
                        <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center font-black text-indigo-600 text-lg uppercase italic">
                              {user.name.charAt(0)}
                           </div>
                           <div className="flex flex-col">
                              <span className="font-black text-foreground uppercase italic group-hover:text-indigo-600 transition-colors">{user.name}</span>
                              <div className="flex items-center gap-3 mt-1">
                                 <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Mail className="h-3 w-3" /> {user.email}</span>
                                 <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground"><Phone className="h-3 w-3" /> {user.mobile}</span>
                              </div>
                           </div>
                        </div>
                     </TableCell>
                     <TableCell className="text-center">
                        <Badge className="bg-indigo-600 text-white font-black px-4 py-1.5 rounded-xl border-none shadow-lg shadow-indigo-600/10 italic text-[10px] tracking-widest">
                           {roles.find(r => r.id === user.roleId)?.name || "GUEST"}
                        </Badge>
                     </TableCell>
                     <TableCell>
                        <div className="flex flex-wrap gap-2 max-w-sm">
                            {user.allowedProjectIds.length === 0 ? (
                              <Badge variant="outline" className="border-indigo-500/30 text-indigo-600 font-bold bg-indigo-500/5 px-4 py-1 rounded-lg italic">ALL SITES (UNRESTRICTED)</Badge>
                           ) : (
                              user.allowedProjectIds.map((pid: string) => {
                                 const p = projectsData.find(project => project.id === pid)
                                 return (
                                    <Badge key={pid} className="bg-muted text-foreground font-bold px-3 py-1 rounded-lg border-border/40 italic">
                                       {p?.name || "Unknown Site"}
                                    </Badge>
                                 )
                              })
                           )}
                        </div>
                     </TableCell>
                     <TableCell className="text-center">
                        {user.isActive ? (
                           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 font-black text-[10px] uppercase italic tracking-widest border border-emerald-500/20">
                              <CheckCircle2 className="h-3 w-3" /> ACTIVE
                           </div>
                        ) : (
                           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-600 font-black text-[10px] uppercase italic tracking-widest border border-rose-500/20">
                              <XCircle className="h-3 w-3" /> INACTIVE
                           </div>
                        )}
                     </TableCell>
                     <TableCell className="px-10 text-right">
                        <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-muted">
                                 <MoreVertical className="h-5 w-5" />
                              </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/40 p-2 shadow-2xl backdrop-blur-3xl">
                              <DropdownMenuItem className="h-12 rounded-xl font-bold cursor-pointer gap-3">
                                 <Edit3 className="h-4 w-4 text-primary" /> Modify Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem className="h-12 rounded-xl font-bold cursor-pointer gap-3 text-rose-500">
                                 <XCircle className="h-4 w-4" /> Deactivate User
                              </DropdownMenuItem>
                           </DropdownMenuContent>
                        </DropdownMenu>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </Card>

      {/* Add User Dialog (Section 7.15 Fields) */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
         <DialogContent className="max-w-2xl rounded-[2.5rem] border-border/40 shadow-3xl p-0 overflow-hidden">
            <div className="p-10 border-b border-border/20 bg-indigo-600/5">
               <DialogTitle className="text-2xl font-black italic tracking-tighter">Onboard Enterprise Identity</DialogTitle>
               <DialogDescription className="font-medium">Define profile, assign role, and map site restrictions.</DialogDescription>
            </div>
            
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Full Name</label>
                     <Input placeholder="Enter user's name" className="h-12 rounded-2xl bg-muted/30 border-border/40 font-bold" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Mobile Number</label>
                     <Input placeholder="+91 XXXX XXX XXX" className="h-12 rounded-2xl bg-muted/30 border-border/40 font-bold" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Email Address</label>
                     <Input placeholder="user@company.com" className="h-12 rounded-2xl bg-muted/30 border-border/40 font-bold" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-1">Role Designation</label>
                     <Select>
                        <SelectTrigger className="h-12 rounded-2xl bg-muted/30 border-border/40 font-bold">
                           <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl border-border/40">
                           {roles.map(r => (<SelectItem key={r.id} value={r.id} className="font-bold">{r.name}</SelectItem>))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-indigo-600 tracking-widest flex items-center gap-2 px-1">
                     <Building2 className="h-3 w-3" /> Site Access Mapping (Multi-Site Restriction)
                  </label>
                  <div className="rounded-[2rem] border border-border/40 bg-muted/10 p-6 space-y-4">
                     <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest border-b border-border/20 pb-2">Select permitted projects</p>
                     <ScrollArea className="h-48 pr-4">
                        <div className="grid grid-cols-1 gap-4">
                           {projectsData.map(p => (
                              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-border/20 hover:border-indigo-500/30 transition-all cursor-pointer group">
                                 <div className="flex items-center gap-3">
                                    <Checkbox id={`p-${p.id}`} className="h-5 w-5 rounded-md border-border/60 data-[state=checked]:bg-indigo-600" />
                                    <label htmlFor={`p-${p.id}`} className="text-sm font-bold text-foreground cursor-pointer group-hover:text-indigo-600">
                                       {p.name}
                                       <span className="block text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{p.type} Operation</span>
                                    </label>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </ScrollArea>
                     <div className="pt-2 flex items-center gap-2">
                        <Checkbox id="all-sites" className="h-4 w-4 rounded-md" />
                        <label htmlFor="all-sites" className="text-[10px] font-black text-muted-foreground uppercase hover:text-indigo-600 cursor-pointer transition-colors">Grant Unrestricted Access to All Sites</label>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 border-t border-border/20 bg-muted/10 flex justify-end gap-3">
               <Button variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl h-12 px-6 font-bold">Discard</Button>
               <Button className="h-12 px-10 rounded-2xl bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all">
                  Onboard User
               </Button>
            </div>
         </DialogContent>
      </Dialog>
      
    </div>
  )
}
