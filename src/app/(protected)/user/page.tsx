'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import PermissionGate from '@/components/shared/PermissionGate';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAuth } from '@/hooks/useAuth';
import { Permissions } from '@/types/rbac';
import { DefaultUserEnum } from '@/types/constanta';

// Lazy load components
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

interface Role {
  id: number;
  name: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [formData, setFormData] = useState({
    id: null,
    username: '',
    password: '',
    fullName: '',
    roleName: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user, logout: authLogout } = useAuth();

  useEffect(() => {
    loadUsers();
    loadRoles();
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
      setLoading(true);
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.users) {
        setUsers(result.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      const result = await response.json();
      if (result.roles && Array.isArray(result.roles)) {
        setRoles(result.roles);
      }
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = isEditing ? `/api/users/${formData.id}` : '/api/users';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(isEditing ? 'User updated successfully' : 'User created successfully');
        clearForm();
        loadUsers();
      } else {
        alert(result.error || `Failed to ${isEditing ? 'update' : 'create'} user`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} user:`, error);
      alert(`An error occurred while ${isEditing ? 'updating' : 'creating'} user`);
    }
  };

  const clearForm = () => {
    setFormData({ id: null, username: '', password: '', fullName: '', roleName: '' });
    setIsEditing(false);
  };

  const handleEdit = (user: User) => {
    setFormData({
      id: user.id,
      username: user.username,
      password: '',
      fullName: user.fullName,
      roleName: user.role.name,
    });
    setIsEditing(true);
  };

  const handleDelete = async (userId: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('User deleted successfully');
        loadUsers();
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting user');
    }
  };

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_USERS]}>
      <div className="p-1">
        <div className="bg-white rounded-lg shadow-md">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 pt-4">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('roles')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'roles'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Role & Permissions
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'users' && (
            <PermissionGate permission={Permissions.CREATE_USERS}>
              <div className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  {isEditing ? 'Edit User' : 'Add User'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter username"
                    />
                  </div>

                  <div className="text-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password *
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        required
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
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <select
                      required
                      value={formData.roleName}
                      onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Select Role</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.name}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2 flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 text-sm"
                    >
                      {isEditing ? 'Update User' : 'Save User'}
                    </button>
                    <button
                      type="button"
                      onClick={clearForm}
                      className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 text-sm"
                    >
                      Cancel
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
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="border-t">
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex gap-2">
                                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : users.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
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
                            <td className="px-4 py-2">
                              {!Object.values(DefaultUserEnum).includes(
                                user.username as DefaultUserEnum
                              ) ? (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEdit(user)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs">Protected</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </PermissionGate>
          )}

          {activeTab === 'roles' && (
            <div className="p-6">
              <Suspense fallback={<LoadingSpinner />}>
                <RolePermissionManager onRoleChange={loadRoles} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
