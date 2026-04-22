"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/use-app-store"
import { User as EnterpriseUser } from "@/types/user"

interface AuthContextType {
  user: EnterpriseUser | null
  login: (emailOrMobile: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EnterpriseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { setUser: setStoreUser, roles } = useAppStore()

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem("erp_user")
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser(parsed)
        setStoreUser(parsed)
      } catch (e) {
        console.error("Failed to parse saved user", e)
        localStorage.removeItem("erp_user")
      }
    }
    setIsLoading(false)
  }, [setStoreUser])

  const login = async (emailOrMobile: string, password: string): Promise<boolean> => {
    // Mock validation
    if (!emailOrMobile || !password) return false

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check credentials from environment variables
    const isOwner = 
      emailOrMobile === process.env.NEXT_PUBLIC_OWNER_ID && 
      password === process.env.NEXT_PUBLIC_OWNER_PASS
    
    const isAdmin = 
      emailOrMobile === process.env.NEXT_PUBLIC_ADMIN_ID && 
      password === process.env.NEXT_PUBLIC_ADMIN_PASS
    
    const isUserRole = 
      emailOrMobile === process.env.NEXT_PUBLIC_USER_ID && 
      password === process.env.NEXT_PUBLIC_USER_PASS

    if (!isOwner && !isAdmin && !isUserRole) return false

    // Map to normalized enterprise roles
    const roleId = isOwner ? "r1" : isAdmin ? "r2" : "r2" // Defaulting Standard to Site Manager r2 for now

    const mockUser: EnterpriseUser = {
      id: isOwner ? "u1" : isAdmin ? "u2" : "u3",
      name: isOwner ? "Aditya Sharma" : isAdmin ? "Priya Varma" : "Standard User",
      email: emailOrMobile.includes('@') ? emailOrMobile : "user@erp-enterprise.com",
      mobile: !emailOrMobile.includes('@') ? emailOrMobile : "9876543210",
      password: "password123",
      roleId: roleId,
      isActive: true,
      allowedProjectIds: isUserRole ? ["p4"] : [], // Full or restricted access
      createdAt: new Date().toISOString()
    }

    setUser(mockUser)
    setStoreUser(mockUser)
    localStorage.setItem("erp_user", JSON.stringify(mockUser))
    return true
  }

  const logout = () => {
    setUser(null)
    setStoreUser(null)
    localStorage.removeItem("erp_user")
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
