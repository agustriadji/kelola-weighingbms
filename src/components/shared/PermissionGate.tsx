'use client'

import { useAuth } from '@/hooks/useAuth'
import { Permissions } from '@/types/rbac'

interface PermissionGateProps {
  children: React.ReactNode
  permission?: Permissions
  permissions?: Permissions[]
  role?: string
  fallback?: React.ReactNode
}

export default function PermissionGate({
  children,
  permission,
  permissions,
  role,
  fallback = null
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasRole } = useAuth()

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>
  }

  // Check multiple permissions (any)
  if (permissions && !hasAnyPermission(permissions)) {
    return <>{fallback}</>
  }

  // Check role
  if (role && !hasRole(role)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}