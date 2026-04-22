import { useAuth } from "@/context/AuthContext"
import { useAppStore } from "@/store/use-app-store"
import { Module, PermissionAction } from "@/lib/rbac"

export function usePermission() {
  const { user } = useAuth()
  const { roles } = useAppStore()
  
  const checkPermission = (module: Module, action: PermissionAction): boolean => {
    if (!user) return false
    
    // 1. Find the role based on the new enterprise roleId
    const role = roles.find(r => r.id === user.roleId)
    if (!role) return false

    // 2. Perform granular boolean check against the PermissionRule schema
    const perms = role.permissions[module]
    if (!perms) return false
    
    return perms[action] ?? false
  }

  const roleName = roles.find(r => r.id === user?.roleId)?.name || "GUEST"

  return {
    checkPermission,
    userRoleName: roleName,
    canView: (module: Module) => checkPermission(module, "view"),
    canCreate: (module: Module) => checkPermission(module, "create"),
    canEdit: (module: Module) => checkPermission(module, "edit"),
    canDelete: (module: Module) => checkPermission(module, "delete"),
    
    // Identity-based convenience flags
    isSuperAdmin: user?.roleId === "r1",
    isAdmin: user?.roleId === "r1" || user?.roleId === "r2",
    isUser: user?.roleId === "r2", // Site Manager level for this specific ERP context
    canBackdate: () => user?.roleId === "r1" || user?.roleId === "r2",
  }
}
