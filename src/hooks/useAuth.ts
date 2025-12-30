'use client';

import { useState, useEffect } from 'react';
import { Permissions } from '@/types/rbac';
import { hwConfigDB } from '@/utils/hwConfigDB';

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  permissions: string[];
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    permissions: [],
    loading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const syncCompleted = localStorage.getItem('hw_sync_completed');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        setAuthState({
          user: payload,
          isAuthenticated: true,
          permissions: payload.permissions || [],
          loading: false,
        });

        // Background sync HW configurations only once per session
        if (!syncCompleted) {
          localStorage.setItem('hw_sync_completed', 'true');
          hwConfigDB.syncAllConfigurations().catch(error => {
            console.warn('Background HW config sync failed:', error);
            localStorage.removeItem('hw_sync_completed'); // Retry on next load if failed
          });
        }
      } catch (error) {
        console.error('❌ JWT decode error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('hw_sync_completed');
        setAuthState({
          user: null,
          isAuthenticated: false,
          permissions: [],
          loading: false,
        });
      }
    } else {
      localStorage.removeItem('hw_sync_completed');
      setAuthState({
        user: null,
        isAuthenticated: false,
        permissions: [],
        loading: false,
      });
    }
  }, []);

  const hasPermission = (permission: Permissions): boolean => {
    return authState.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: Permissions[]): boolean => {
    const result = permissions.some((p) => authState.permissions.includes(p));
    //console.log('🔍 Checking permissions:', permissions, 'User has:', authState.permissions, 'Result:', result);
    return result;
  };

  const hasRole = (roleName: string): boolean => {
    return authState.user?.role === roleName;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('hw_sync_completed'); // Clear sync flag on logout
    setAuthState({
      user: null,
      isAuthenticated: false,
      permissions: [],
      loading: false,
    });
  };

  return {
    ...authState,
    hasPermission,
    hasAnyPermission,
    hasRole,
    logout,
  };
};
