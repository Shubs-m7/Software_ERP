"use client"

import React, { useState } from "react"
import { ShieldCheck, Loader2, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const [emailOrMobile, setEmailOrMobile] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!emailOrMobile.trim()) {
      setError("Please enter your email or mobile number.")
      return
    }
    if (!password.trim()) {
      setError("Please enter your password.")
      return
    }

    setIsSubmitting(true)
    try {
      const success = await login(emailOrMobile, password)
      if (success) {
        router.push("/dashboard/parking")
      } else {
        setError("Invalid credentials. Please try again.")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-zinc-950">
      {/* Visual Side - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#3e3e3e,transparent)] opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
        
        <div className="flex items-center gap-2 z-10">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-black shadow-xl">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-white">SOFTWARE V2</span>
        </div>

        <div className="space-y-6 z-10">
          <h1 className="text-5xl font-bold tracking-tight text-white max-w-md leading-tight">
            Centralized Command for Modern Enterprises.
          </h1>
          <p className="text-lg text-zinc-400 max-w-sm">
            Streamline transactions, manage masters, and generate real-time reports with elite performance.
          </p>
          <div className="flex items-center gap-4 pt-4 text-zinc-500 text-sm font-medium">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-zinc-900 bg-zinc-800" />
                ))}
             </div>
             <span>Joined by 500+ enterprises</span>
          </div>
        </div>

        <div className="text-zinc-600 text-xs font-mono tracking-widest z-10 uppercase">
          Build 2026.04.18 // System Auth Validated
        </div>
      </div>

      {/* Auth Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#3e3e3e,transparent)] lg:hidden opacity-20 pointer-events-none" />
        
        <div className="w-full max-w-[400px] space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:hidden flex flex-col items-center gap-4 text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-black shadow-2xl">
              <ShieldCheck className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Welcome back</h2>
              <p className="text-zinc-400 text-sm">Sign in to your enterprise account</p>
            </div>
          </div>

          <div className="hidden lg:block space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
            <p className="text-zinc-400">Please enter your details to sign in.</p>
          </div>

          <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-3xl shadow-2xl rounded-2xl overflow-hidden">
            <CardContent className="pt-8">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider ml-1">Email / Mobile</label>
                  <Input 
                    type="text" 
                    placeholder="name@company.com" 
                    value={emailOrMobile}
                    onChange={(e) => setEmailOrMobile(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 focus:ring-zinc-600 h-12 px-4 rounded-xl border-2 hover:border-zinc-700 transition-all focus:border-zinc-500"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                    <a href="#" className="text-xs text-zinc-500 hover:text-white transition-colors">Forgot?</a>
                  </div>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    className="bg-zinc-950/50 border-zinc-800 text-white placeholder:text-zinc-700 focus:ring-zinc-600 h-12 px-4 rounded-xl border-2 hover:border-zinc-700 transition-all focus:border-zinc-500"
                  />
                </div>

                {error && (
                  <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm py-3 px-4 rounded-xl flex items-start gap-3">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-white text-black hover:bg-zinc-200 h-12 font-bold rounded-xl shadow-xl shadow-white/5 active:scale-[0.98] transition-all text-base border-none"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Sign in to Dashboard"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="bg-zinc-950/30 border-t border-white/5 py-4 flex justify-center">
               <p className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
                 Military Grade Encryption Active
               </p>
            </CardFooter>
          </Card>
          
          <p className="text-center text-zinc-600 text-xs">
            Not part of an enterprise yet? <a href="#" className="text-zinc-400 hover:text-white transition-colors underline underline-offset-4">Contact Sales</a>
          </p>
        </div>
      </div>
    </div>
  )
}
