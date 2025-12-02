'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';
import WeighingDisplay from '@/components/WeighingDisplay';
import ProtectedRoute from '@/components/ProtectedRoute';
import PermissionGate from '@/components/PermissionGate';
import { useAuth } from '@/hooks/useAuth';
import { Permissions } from '@/types/rbac';
import Image from 'next/image';

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

  const getFilterLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      'raw-material': 'RAW MATERIAL (INCOMING)',
      despatch: 'DESPATCH (OUTGOING)',
      'material-store': 'MATERIAL STORE (MISCELLANEOUS)',
    };
    return labels[value] || value;
  };

  if (!loginData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_WEIGHING]}>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Image src="/logo.png" alt="Evyap" width={120} height={40} />
                <div className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                  Life Chemistry
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <PermissionGate permissions={[user?.permissions[Permissions.CREATE_WEIGHING]]}>
                  <button className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200">
                    Weighing
                  </button>
                </PermissionGate>
                <PermissionGate permissions={[user?.permissions[Permissions.CREATE_INCOMING]]}>
                  <button
                    onClick={() => router.push('/user')}
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200"
                  >
                    Registering
                  </button>
                </PermissionGate>
                <PermissionGate permissions={[user?.permissions[Permissions.CREATE_USERS]]}>
                  <button
                    onClick={() => router.push('/user')}
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200"
                  >
                    User
                  </button>
                </PermissionGate>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="bg-white rounded-lg shadow-md p-2">
            <WeighingDisplay />
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
