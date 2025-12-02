'use client';

import PermissionGate from '../PermissionGate';
import { Permissions } from '@/types/rbac';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function MenuShared() {
  const { user, logout: authLogout } = useAuth();
  const router = useRouter();
  const handleLogout = () => {
    authLogout();
    router.push('/login');
  };
  return (
    <div className="flex items-center space-x-4">
      <button className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200">
        Dashboard
      </button>
      <PermissionGate permission={Permissions.CREATE_OUTGOING}>
        <button
          onClick={() => router.push('/user')}
          className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200"
        >
          Registering
        </button>
      </PermissionGate>
      <PermissionGate permission={Permissions.CREATE_WEIGHING}>
        <button
          onClick={() => router.push('/user')}
          className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200"
        >
          Weighing
        </button>
      </PermissionGate>
      <PermissionGate permission={Permissions.VIEW_USERS}>
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
  );
}
