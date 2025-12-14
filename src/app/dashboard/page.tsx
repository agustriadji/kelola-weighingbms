'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import NavbarTemplate from '@/components/templates/NavbarTemplate';
import { Permissions } from '@/types/rbac';
import { useSysStore } from '@/store/sys.store';
import HardwareControlSidebar from '@/components/organisms/HardwareControlSidebar';

// Lazy load components
const Footer = lazy(() => import('@/components/templates/Footer'));
const WeighingDisplay = lazy(() => import('@/components/pages/Weighing/WeighingDisplay.page'));
const HardwareControlSidebarLazy = lazy(
  () => import('@/components/organisms/HardwareControlSidebar')
);

interface LoginData {
  username: string;
  password: string;
  filterJenis: string;
  loginTime: string;
}

export default function DashboardPage() {
  const { setLoadingState } = useSysStore();
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const router = useRouter();
  // const { user, logout: authLogout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const storedLoginData = localStorage.getItem('loginData');
    if (storedLoginData) {
      setLoginData(JSON.parse(storedLoginData));
    }
    setLoadingState(false);
  }, [router, setLoadingState]);

  // const handleLogout = () => {
  //   authLogout();
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('loginData');
  //   localStorage.removeItem('userData');
  //   localStorage.removeItem('user');
  //   router.push('/login');
  // };

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_WEIGHING]}>
      <div className="min-h-screen bg-gray-100 z-999">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NavbarTemplate />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="p-1">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <LoadingSpinner size="lg" text="Loading weighing display..." />
                </div>
              }
            >
              <div className="flex flex-col-4 space-x-4">
                <WeighingDisplay />
                <div></div>
                <HardwareControlSidebarLazy />
              </div>
            </Suspense>
          </div>
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
      </div>
    </ProtectedRoute>
  );
}
