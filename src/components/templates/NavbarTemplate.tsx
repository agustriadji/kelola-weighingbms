import Image from 'next/image';
import PermissionGate from '../shared/PermissionGate';
import { Permissions } from '@/types/rbac';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import RolePermissionManager from '../shared/RolePermissionManager';

export default function NavbarTemplate() {
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();
  const [activeState, setActiveState] = useState('');
  const [showRoleManager, setShowRoleManager] = useState(false);
  const handleLogout = () => {
    authLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('loginData');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const changeActive = (url) => {
    setActiveState(url);
    if (url === '/role') {
      setShowRoleManager(true);
    } else {
      setShowRoleManager(false);
      router.push(url);
    }
  };

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Image src="/logo.png" alt="Evyap" width={120} height={40} />
        <div className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
          Life Chemistry
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <PermissionGate permissions={[Permissions.CREATE_USERS]}>
          <button
            onClick={() => {
              changeActive('/dashboard');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${activeState === '/dashboard' ? 'bg-blue-600 text-white' : 'hover:text-blue-600'}
              `}
          >
            Weighing
          </button>
        </PermissionGate>
        <PermissionGate permission={Permissions.CREATE_INCOMING}>
          <button
            onClick={() => {
              changeActive('/pos-one');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${activeState === '/pos-one' ? 'bg-blue-600 text-white' : 'hover:text-blue-600'}
              `}
          >
            Registering
          </button>
        </PermissionGate>
        <PermissionGate permission={Permissions.CREATE_USERS}>
          <button
            onClick={() => {
              changeActive('/user');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${activeState === '/user' ? 'bg-blue-600 text-white' : 'hover:text-blue-600'}
              `}
          >
            User
          </button>
          <button
            onClick={() => {
              changeActive('/role');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${activeState === '/role' ? 'bg-blue-600 text-white' : 'hover:text-blue-600'}
              `}
          >
            Roles
          </button>
        </PermissionGate>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
        >
          Logout
        </button>
      </div>

      {showRoleManager && <RolePermissionManager onClose={() => setShowRoleManager(false)} />}
    </div>
  );
}
