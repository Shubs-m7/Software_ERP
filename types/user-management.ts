import { Role } from "@/lib/rbac";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: Role;
  status: "Active" | "Inactive";
  lastLogin?: string;
  avatar?: string;
}
