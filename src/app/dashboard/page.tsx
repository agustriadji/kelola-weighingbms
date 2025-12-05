'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/templates/Footer';
import WeighingDisplay from '@/components/pages/Weighing/WeighingDisplay.page';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { Permissions } from '@/types/rbac';

import NavbarTemplate from '@/components/templates/NavbarTemplate';

interface LoginData {
  username: string;
  password: string;
  filterJenis: string;
  loginTime: string;
}

interface UserData {
  id: number;
  permissions: Permissions[];
}

export default function DashboardPage() {
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();

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
  }, [router]);

  const handleLogout = () => {
    authLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('loginData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!loginData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_WEIGHING]}>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NavbarTemplate user={user} handleLogout={handleLogout} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="bg-white rounded-lg shadow-md p-1">
            <WeighingDisplay />
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
