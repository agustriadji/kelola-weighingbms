'use client';

import { useAuth } from '@/hooks/useAuth';
import { Permissions } from '@/types/rbac';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permissions;
  requiredPermissions?: Permissions[];
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  requiredPermission,
  requiredPermissions,
  requiredRole,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading, hasPermission, hasAnyPermission, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check single permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return fallback || <UnauthorizedAccess />;
  }

  // Check multiple permissions (any)

  if (requiredPermissions && !hasAnyPermission(requiredPermissions)) {
    return fallback || <UnauthorizedAccess />;
  }

  // Check role
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || <UnauthorizedAccess />;
  }

  return <>{children}</>;
}

function UnauthorizedAccess() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-red-500 text-6xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600">{`You don't have permission to access this page.`}</p>
      </div>
    </div>
  );
}
