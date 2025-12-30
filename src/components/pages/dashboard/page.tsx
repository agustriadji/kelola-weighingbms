'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import NavbarTemplate from '@/components/templates/NavbarTemplate';
import { Permissions } from '@/types/rbac';
import { useSysStore } from '@/store/sys.store';
import Footer from '@/components/templates/Footer';

export default function DashboardPageComponent() {
  const { setLoadingState } = useSysStore();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setLoadingState(false);
  }, []);

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_WEIGHING]}>
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NavbarTemplate />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              <LoadingSpinner size="lg" text="Loading weighing display..." />
            </div>
          }
        >
          <div className="flex flex-col-4 space-x-4">{/* CONTENT DASHBOARD */}</div>
        </Suspense>
      </div>
      <Suspense
        fallback={
          <div className="h-16 flex items-center justify-center">
            <LoadingSpinner size="sm" />
          </div>
        }
      >
        <Footer />
      </Suspense>
    </ProtectedRoute>
  );
}
