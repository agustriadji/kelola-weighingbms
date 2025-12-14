'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import PermissionGate from '@/components/shared/PermissionGate';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import NavbarTemplate from '@/components/templates/NavbarTemplate';
import { useAuth } from '@/hooks/useAuth';
import { Permissions } from '@/types/rbac';

// Lazy load components
const Footer = lazy(() => import('@/components/templates/Footer'));
const RolePermissionManager = lazy(() => import('@/components/shared/RolePermissionManager'));

interface User {
  id: number;
  username: string;
  fullName: string;
  role: {
    id: number;
    name: string;
  };
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [showRoleManager, setShowRoleManager] = useState(false);
  const [activeState, setActiveState] = useState('/user');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    roleName: 'Admin',
  });
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadUsers();
  }, [router]);

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.users) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('User created successfully');
        setFormData({ username: '', password: '', fullName: '', roleName: 'Admin' });
        loadUsers();
      } else {
        alert(result.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred while creating user');
    }
  };

  const handleLogout = () => {
    authLogout();
    router.push('/login');
  };

  const changeActive = (url) => {
    setActiveState(url);
    if (url === '/role') {
      setShowRoleManager(true);
    } else {
      setShowRoleManager(false);
    }

    router.push(url);
  };

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_USERS]}>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NavbarTemplate />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="bg-cyan-200 rounded-lg shadow-md p-1">
            {/* Form User */}
            <PermissionGate permission={Permissions.CREATE_USERS}>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Add User</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="text-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700 text-sm"
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      value={formData.roleName}
                      onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Operator_Registrasi">Operator Registration</option>
                      <option value="Operator_Weighing">Operator Weighing</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      Save User
                    </button>
                  </div>
                </form>
              </div>
              {/* Table List User */}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">User List</h2>

                <div className="overflow-x-auto bg-white shadow-sm relative">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr className="text-left">
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Username</th>
                        <th className="px-4 py-2">Full Name</th>
                        <th className="px-4 py-2">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No user data available
                          </td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-t">
                            <td className="px-4 py-2">{user.id}</td>
                            <td className="px-4 py-2">{user.username}</td>
                            <td className="px-4 py-2">{user.fullName}</td>
                            <td className="px-4 py-2">{user.role.name}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </PermissionGate>
          </div>
        </div>
        <Suspense fallback={<div className="h-16 flex items-center justify-center"><LoadingSpinner size="sm" /></div>}>
          <Footer />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
