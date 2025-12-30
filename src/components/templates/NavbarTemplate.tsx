import Image from 'next/image';
import PermissionGate from '../shared/PermissionGate';
import { Permissions } from '@/types/rbac';
import { useNav } from '@/hooks/useNav.hook';
import { useRouter } from 'next/navigation';

export default function NavbarTemplate() {
  const { handlerLogout, changeActive, menuHeaderState } = useNav();
  const router = useRouter();

  async function handleChangeMenu(url) {
    url = await changeActive(url);
    if (url && menuHeaderState !== url) router.push(url);
  }

  async function handleLogoutAction() {
    await handlerLogout();
    router.push('/login');
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Image src="/images/logo_B.png" alt="Evyap" width={120} height={60} />
      </div>
      <div className="flex items-center space-x-4">
        <PermissionGate permissions={[Permissions.CREATE_USERS]}>
          <button
            onClick={() => {
              handleChangeMenu('/pos-weighing');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${
                  menuHeaderState === '/pos-weighing'
                    ? 'bg-blue-600 text-white'
                    : 'hover:text-blue-600'
                }
              `}
          >
            Weighing
          </button>
        </PermissionGate>
        <PermissionGate permission={Permissions.CREATE_INCOMING}>
          <button
            onClick={() => {
              handleChangeMenu('/pos-one');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${menuHeaderState === '/pos-one' ? 'bg-blue-600 text-white' : 'hover:text-blue-600'}
              `}
          >
            Registering
          </button>
        </PermissionGate>
        <PermissionGate permission={Permissions.CREATE_USERS}>
          <button
            onClick={() => {
              handleChangeMenu('/user');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${menuHeaderState === '/user' ? 'bg-blue-600 text-white' : 'hover:text-blue-600'}
              `}
          >
            User & Role
          </button>
          <button
            onClick={() => {
              handleChangeMenu('/hw-configuration');
            }}
            className={`
                text-gray-600 px-3 py-2 rounded-md transition duration-200 text-sm 
                ${
                  menuHeaderState === '/hw-configuration'
                    ? 'bg-blue-600 text-white'
                    : 'hover:text-blue-600'
                }
              `}
          >
            HW/Configuration
          </button>
        </PermissionGate>
        <button
          onClick={handleLogoutAction}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
