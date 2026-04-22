import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Project } from "@/types/project"
import { ChangeRequest } from "@/types/change-request"
import { UnifiedTransaction } from "@/types/unified-transaction"
import { dailyTransactionsData, projectsData, changeRequestsData, roles, usersData } from "@/lib/mock-data"
import { Voucher } from "@/types/voucher"
import { Partner } from "@/types/partner"
import { Transporter } from "@/types/transporter"
import { VehicleType } from "@/types/vehicle-type"
import { GlobalSettings, DynamicRole } from "@/types/settings"
import { AuditLog, AuditAction } from "@/types/audit-log"
import { User, UserRole } from "@/types/user"

import { BankGuarantee, SecurityDeposit } from "@/types/other-masters"

interface AppState {
  user: User | null
  roles: UserRole[]
  users: User[]
  selectedProject: Project | null
  businessType: "PARKING" | "BALU" | null
  changeRequests: ChangeRequest[]
  transactions: UnifiedTransaction[]
  vouchers: Voucher[]
  partners: Partner[]
  transporters: Transporter[]
  vehicleTypes: VehicleType[]
  bankGuarantees: BankGuarantee[]
  securityDeposits: SecurityDeposit[]
  settings: GlobalSettings
  auditLogs: AuditLog[]
  
  // Actions
  recordAudit: (action: AuditAction, module: string, refId: string, description: string) => void
  setUser: (user: User | null) => void
  setSelectedProject: (project: Project | null) => void
  logout: () => void

  // Change Request Actions
  addChangeRequest: (request: ChangeRequest) => void
  updateChangeRequestStatus: (requestId: string, status: ChangeRequest["status"]) => void

  // Transaction Actions
  setTransactions: (transactions: UnifiedTransaction[]) => void
  updateTransaction: (updatedTx: UnifiedTransaction) => void

  // Voucher Actions
  addVoucher: (voucher: Voucher) => void

  // Master Actions
  setPartners: (partners: Partner[]) => void
  addPartner: (partner: Partner) => void
  updatePartner: (partner: Partner) => void

  setTransporters: (transporters: Transporter[]) => void
  addTransporter: (transporter: Transporter) => void
  updateTransporter: (transporter: Transporter) => void

  setVehicleTypes: (vehicleTypes: VehicleType[]) => void
  addVehicleType: (vehicleType: VehicleType) => void
  updateVehicleType: (vehicleType: VehicleType) => void

  // Bank Guarantee & Security Deposit Actions
  addBankGuarantee: (bg: BankGuarantee) => void
  updateBankGuarantee: (bg: BankGuarantee) => void
  addSecurityDeposit: (sd: SecurityDeposit) => void
  updateSecurityDeposit: (sd: SecurityDeposit) => void

  // Admin Actions
  updateSettings: (settings: Partial<GlobalSettings>) => void
  updateRole: (role: UserRole) => void
  checkPermission: (module: 'masters' | 'transactions' | 'reports', action: string) => boolean
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      selectedProject: null,
      businessType: null,
      changeRequests: changeRequestsData,
      transactions: dailyTransactionsData,
      vouchers: [],
      partners: [],
      transporters: [],
      vehicleTypes: [],
      bankGuarantees: [],
      securityDeposits: [],
      settings: {
        currentFinancialYear: "2024-25",
        allowBackdatedEntries: true,
        backdateLimitDays: 90,
        requireApprovalForEdits: true
      },
      roles: roles,
      users: usersData,
      auditLogs: [],

      // Implement BG/SD actions
      addBankGuarantee: (bg) => set((state) => {
        state.recordAudit("CREATE", "Masters/BankGuarantee", bg.id, `BG ${bg.bgNumber} added`)
        return { bankGuarantees: [bg, ...state.bankGuarantees] }
      }),
      updateBankGuarantee: (updated) => set((state) => {
         state.recordAudit("UPDATE", "Masters/BankGuarantee", updated.id, `BG ${updated.bgNumber} updated`)
         return {
           bankGuarantees: state.bankGuarantees.map(b => b.id === updated.id ? updated : b)
         }
      }),

      addSecurityDeposit: (sd) => set((state) => {
        state.recordAudit("CREATE", "Masters/SecurityDeposit", sd.id, `Security Deposit ${sd.particulars} added`)
        return { securityDeposits: [sd, ...state.securityDeposits] }
      }),
      updateSecurityDeposit: (updated) => set((state) => {
         state.recordAudit("UPDATE", "Masters/SecurityDeposit", updated.id, `Security Deposit ${updated.particulars} updated`)
         return {
           securityDeposits: state.securityDeposits.map(s => s.id === updated.id ? updated : s)
         }
      }),

      recordAudit: (action, module, refId, description) => {
        const state = get()
        if (!state.user) return
        
        const newLog: AuditLog = {
          id: `log-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toLocaleString(),
          userId: state.user.email, // using email as identifier
          userName: state.user.name,
          userRole: roles.find(r => r.id === state.user?.roleId)?.name || "GUEST",
          action,
          module,
          referenceId: refId,
          description,
        }
        
        set((state) => ({
          auditLogs: [newLog, ...state.auditLogs]
        }))
      },

      setUser: (user) => {
        set({ user })
        const isLockdown = (user && user?.allowedProjectIds?.length === 1) || false
        if (user && user?.allowedProjectIds && user.allowedProjectIds.length > 0) {
          // If user has a restricted set, auto-select the first one if none selected
          const state = get()
          if (!state.selectedProject || !user.allowedProjectIds.includes(state.selectedProject.id)) {
            const firstAllowed = projectsData.find(p => p.id === user.allowedProjectIds[0])
            if (firstAllowed) {
              set({ 
                selectedProject: firstAllowed as any,
                businessType: firstAllowed.type
              })
            }
          }
        }
      },
      
      setSelectedProject: (project) => {
        const state = get()
        // Enforce Site-Restricted Visibility (Phase 8 logic)
        if (state.user && state.user?.allowedProjectIds && state.user.allowedProjectIds.length > 0) {
           if (project && !state.user.allowedProjectIds.includes(project.id)) {
             // Block selection of projects not assigned to this user
             return
           }
        }
        
        set({ 
          selectedProject: project,
          businessType: project?.type || null 
        })
      },

      logout: () => set({ user: null, selectedProject: null, businessType: null }),

      addChangeRequest: (request) => set((state) => ({
        changeRequests: [request, ...state.changeRequests]
      })),

      updateChangeRequestStatus: (requestId, status) => set((state) => ({
        changeRequests: state.changeRequests.map((r) => 
          r.id === requestId ? { ...r, status } : r
        )
      })),

      setTransactions: (transactions) => {
        set({ transactions })
        get().recordAudit("UPDATE", "Transactions", "batch", "Daily transaction batch updated")
      },

      updateTransaction: (updatedTx) => set((state) => {
        state.recordAudit("UPDATE", "Transactions", updatedTx.id, `Transaction entry ${updatedTx.id} modified`)
        return {
          transactions: state.transactions.map((tx) => 
            tx.id === updatedTx.id ? updatedTx : tx
          )
        }
      }),
      addVoucher: (voucher) => set((state) => {
        state.recordAudit("CREATE", "Vouchers", voucher.id, `New ${voucher.type} voucher ${voucher.voucherNo} posted`)
        return {
          vouchers: [voucher, ...state.vouchers]
        }
      }),

      // Master Implementations
      setPartners: (partners) => set({ partners }),
      addPartner: (partner) => set((state) => {
        state.recordAudit("CREATE", "Masters/Partners", partner.id, `Partner ${partner.name} registered`)
        return { partners: [partner, ...state.partners] }
      }),
      updatePartner: (updated) => set((state) => {
        state.recordAudit("UPDATE", "Masters/Partners", updated.id, `Partner ${updated.name} updated`)
        return {
          partners: state.partners.map(p => p.id === updated.id ? updated : p)
        }
      }),

      setTransporters: (transporters) => set({ transporters }),
      addTransporter: (transporter) => set((state) => ({ transporters: [transporter, ...state.transporters] })),
      updateTransporter: (updated) => set((state) => ({
        transporters: state.transporters.map(t => t.id === updated.id ? updated : t)
      })),

      setVehicleTypes: (vehicleTypes) => set({ vehicleTypes }),
      addVehicleType: (vType) => set((state) => ({ vehicleTypes: [vType, ...state.vehicleTypes] })),
      updateVehicleType: (updated) => set((state) => ({
        vehicleTypes: state.vehicleTypes.map(v => v.id === updated.id ? updated : v)
      })),

      // Admin Implementations
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
      updateRole: (role) => set((state) => ({
        roles: state.roles.some(r => r.id === role.id)
          ? state.roles.map(r => r.id === role.id ? role : r)
          : [...state.roles, role]
      })),

      checkPermission: (module, action) => {
        const state = get()
        if (!state.user) return false
        
        const role = state.roles.find(r => r.id === state.user?.roleId)
        if (!role) return false
        
        // Super Admin Bypass
        if (role.name === "Super Admin") return true
        
        const modulePermissions = role.permissions[module] as any
        if (!modulePermissions) return false

        // Check for specific action or fallback to 'view' if only module-level check is needed
        if (action === 'view') return modulePermissions.view
        if (action === 'create') return modulePermissions.create
        if (action === 'edit') return modulePermissions.edit
        if (action === 'delete') return modulePermissions.delete
        
        return modulePermissions.view // Default fallback
      }
    }),
    {
      name: "erp-app-storage",
    }
  )
)
