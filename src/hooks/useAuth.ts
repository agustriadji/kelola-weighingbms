'use client'

import { useState, useEffect } from 'react'
import { Permissions } from '@/types/rbac'

interface AuthState {
  user: any | null
  isAuthenticated: boolean
  permissions: string[]
  loading: boolean
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    permissions: [],
    loading: true
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log('JWT payload:', payload)
        setAuthState({
          user: payload,
          isAuthenticated: true,
          permissions: payload.permissions || [],
          loading: false
        })
      } catch (error) {
        console.error('JWT decode error:', error)
        localStorage.removeItem('token')
        setAuthState({
          user: null,
          isAuthenticated: false,
          permissions: [],
          loading: false
        })
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        permissions: [],
        loading: false
      })
    }
  }, [])

  const hasPermission = (permission: Permissions): boolean => {
    return authState.permissions.includes(permission)
  }

  const hasAnyPermission = (permissions: Permissions[]): boolean => {
    return permissions.some(p => authState.permissions.includes(p))
  }

  const hasRole = (roleName: string): boolean => {
    return authState.user?.role === roleName
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuthState({
      user: null,
      isAuthenticated: false,
      permissions: [],
      loading: false
    })
  }

  return {
    ...authState,
    hasPermission,
    hasAnyPermission,
    hasRole,
    logout
  }
}

