export type Role = "OWNER" | "ADMIN" | "USER";

export type Module = 
  | "dashboard" 
  | "masters" 
  | "transactions" 
  | "reports" 
  | "users";

export type PermissionAction = "view" | "create" | "edit" | "delete";

interface PermissionRule {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

const RULES: Record<Role, Partial<Record<Module, PermissionRule>>> = {
  OWNER: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    masters: { view: true, create: true, edit: true, delete: true },
    transactions: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
  },
  ADMIN: {
    dashboard: { view: true, create: true, edit: true, delete: true },
    masters: { view: true, create: true, edit: true, delete: true },
    transactions: { view: true, create: true, edit: true, delete: true },
    reports: { view: true, create: true, edit: true, delete: true },
    users: { view: true, create: true, edit: true, delete: true },
  },
  USER: {
    dashboard: { view: true, create: false, edit: false, delete: false },
    masters: { view: false, create: false, edit: false, delete: false },
    transactions: { view: true, create: true, edit: false, delete: false },
    reports: { view: false, create: false, edit: false, delete: false },
    users: { view: false, create: false, edit: false, delete: false },
  },
};

const DEFAULT_PERMISSION: PermissionRule = {
  view: false,
  create: false,
  edit: false,
  delete: false,
};

export function getPermissions(role: Role, module: Module): PermissionRule {
  return RULES[role]?.[module] || DEFAULT_PERMISSION;
}

export function hasPermission(role: Role | undefined, module: Module, action: PermissionAction): boolean {
  if (!role) return false;
  const permissions = getPermissions(role, module);
  return permissions[action];
}

export function canView(role: Role | undefined, module: Module): boolean {
  return hasPermission(role, module, "view");
}

export function canCreate(role: Role | undefined, module: Module): boolean {
  return hasPermission(role, module, "create");
}

export function canEdit(role: Role | undefined, module: Module): boolean {
  return hasPermission(role, module, "edit");
}

export function canDelete(role: Role | undefined, module: Module): boolean {
  return hasPermission(role, module, "delete");
}

export function canBackdate(role: Role | undefined): boolean {
  return role !== "USER";
}

export function getModuleFromPath(path: string): Module | null {
  if (path.includes("/masters/users")) return "users";
  if (path.includes("/administration/change-requests")) return "users"; // Use users/admin permission
  if (path.includes("/dashboard")) return "dashboard";
  if (path.includes("/masters")) return "masters";
  if (path.includes("/transactions/daily-entries")) return "transactions"; // Reusing transactions module permission
  if (path.includes("/transactions")) return "transactions";
  if (path.includes("/reports")) return "reports";
  return null;
}

