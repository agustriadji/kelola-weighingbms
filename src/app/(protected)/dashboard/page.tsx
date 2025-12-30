'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Permissions } from '@/types/rbac';
import { useSysStore } from '@/store/sys.store';
import HardwareControlSidebar from '@/components/organisms/HardwareControlSidebar';

// Lazy load components
const WeighingDisplay = lazy(() => import('@/components/pages/Weighing/WeighingDisplay.page'));

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
      //router.push('/login');
      return;
    }

    const storedLoginData = localStorage.getItem('loginData');
    if (storedLoginData) {
      setLoginData(JSON.parse(storedLoginData));
    }
    setLoadingState(false);
  }, [router, setLoadingState]);

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_WEIGHING]}>
      <div className="p-1">
        <Suspense
          fallback={
            <div className="h-96 flex items-center justify-center">
              <LoadingSpinner size="lg" text="Loading weighing display..." />
            </div>
          }
        >
          {/* Gunakan grid agar proporsi konsisten */}
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-3">{/* <WeighingDisplay /> */}</div>
            <div className="col-span-1">{/* <HardwareControlSidebar /> */}</div>
          </div>
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
