import Image from 'next/image';
import PermissionGate from '../shared/PermissionGate';
import { Permissions } from '@/types/rbac';
import { useRouter } from 'next/navigation';

export default function NavbarTemplate({ user, handleLogout }) {
  const router = useRouter();
  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <Image src="/logo.png" alt="Evyap" width={120} height={40} />
        <div className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
          Life Chemistry
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <PermissionGate permission={user?.permissions[Permissions.CREATE_WEIGHING]}>
          <button className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200">
            Weighing
          </button>
        </PermissionGate>
        <PermissionGate permission={user?.permissions[Permissions.CREATE_INCOMING]}>
          <button
            onClick={() => router.push('/user')}
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200"
          >
            Registering
          </button>
        </PermissionGate>
        <PermissionGate permission={user?.permissions[Permissions.CREATE_USERS]}>
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
  );
}
