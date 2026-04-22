"use client"

import React from "react"
import { usePermission } from "@/hooks/use-permission"
import { Module, PermissionAction } from "@/lib/rbac"

interface PermissionGuardProps {
  module: Module
  action: PermissionAction
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({
  module,
  action,
  children,
  fallback = null,
}: PermissionGuardProps) {
  const { checkPermission } = usePermission()

  if (!checkPermission(module, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
