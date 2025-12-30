'use client';

import { useEffect, useState } from 'react';
import NavbarTemplate from '@/components/templates/NavbarTemplate';
import Footer from '@/components/templates/Footer';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Permissions } from '@/types/rbac';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState<any>(null);

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

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <ProtectedRoute
      requiredPermissions={[
        Permissions.VIEW_DASHBOARD,
        Permissions.CREATE_WEIGHING,
        Permissions.CREATE_INCOMING,
      ]}
    >
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="w-3/4 mx-auto px-4 sm:px-6 lg:px-8">
          <NavbarTemplate />
        </div>
      </div>

      <main className="w-3/4 mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">{children}</main>

      <Footer />
    </ProtectedRoute>
  );
}
