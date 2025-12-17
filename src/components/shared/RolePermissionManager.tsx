/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { DefaulRoleEnum, DefaultPermissionEnum } from '@/types/constanta';

interface RolePermissionManagerProps {
  onClose?: () => void;
  onRoleChange?: () => void;
}

export default function RolePermissionManager({ onClose, onRoleChange }: RolePermissionManagerProps = {}) {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  //const [users, setUsers] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<any | null>(null);

  const [newRoleName, setNewRoleName] = useState('');
  const [newPermissionName, setNewPermissionName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  // const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  // const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [rolesRes, permsRes] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/permissions'),
      ]);

      const [rolesData, permsData] = await Promise.all([rolesRes.json(), permsRes.json()]);

      console.info(rolesData.roles, 'rolesData.roles');
      if (rolesData.roles) setRoles(rolesData.roles);
      if (permsData.permissions) setPermissions(permsData.permissions);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return;

    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName, permissionIds: selectedPermissions }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Role created successfully');
        setNewRoleName('');
        setSelectedPermissions([]);
        setSelectedRole(null);
        loadData();
        onRoleChange?.();
      } else {
        alert(result.error || 'Failed to create role');
      }
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Error creating role');
    }
  };

  const handleCreatePermission = async () => {
    if (!newPermissionName.trim()) return;
    // TODO: Implement API call to create permission
  };

  // const handleAssignRole = async () => {
  //   if (!selectedUserId || !selectedRoleId) return;
  //   // TODO: Implement API call to assign role
  // };

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await fetch(`/api/roles?id=${roleId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert('Role deleted successfully');
        setSelectedRole(null);
        setNewRoleName('');
        setSelectedPermissions([]);
        loadData();
        onRoleChange?.();
      } else {
        alert(result.error || 'Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      alert('Error deleting role');
    }
  };

  const handleUpdateRolePermissions = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch('/api/roles/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: selectedRole.id, permissionIds: selectedPermissions }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Role permissions updated successfully');
        setSelectedRole(null);
        setNewRoleName('');
        setSelectedPermissions([]);
        loadData();
        onRoleChange?.();
      } else {
        alert(result.error || 'Failed to update role permissions');
      }
    } catch (error) {
      console.error('Error updating role permissions:', error);
      alert('Error updating role permissions');
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Role & Permission Management</h2>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { key: 'roles', label: 'Roles' },
            { key: 'permissions', label: 'Permissions' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 ${
                activeTab === tab.key ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="w-full">
        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create/Edit Role */}
            <div>
              <h3 className="font-semibold mb-3">{selectedRole ? 'Edit Role' : 'Create New Role'}</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Role name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />

                <div>
                  <label className="block text-sm font-medium mb-2">Permissions</label>
                  <div className="max-h-40 overflow-y-auto border rounded p-2">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-2 mb-1">
                          <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                        </div>
                      ))
                    ) : (
                      permissions.map((perm) => (
                        <label key={perm.id} className="flex items-center space-x-2 mb-1">
                          <input
                            type="checkbox"
                            checked={selectedPermissions.includes(perm.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPermissions([...selectedPermissions, perm.id]);
                              } else {
                                setSelectedPermissions(
                                  selectedPermissions.filter((id) => id !== perm.id)
                                );
                              }
                            }}
                          />
                          <span className="text-sm">{perm.name}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!selectedRole ? (
                    <>
                      <button
                        onClick={handleCreateRole}
                        className="btn-primary btn-sm"
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setNewRoleName('');
                          setSelectedPermissions([]);
                        }}
                        className="btn-secondary btn-sm"
                      >
                        Clear
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleUpdateRolePermissions}
                        className="btn-success btn-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDeleteRole(selectedRole.id)}
                        className="btn-danger btn-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRole(null);
                          setNewRoleName('');
                          setSelectedPermissions([]);
                        }}
                        className="btn-secondary btn-sm"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Existing Roles */}
            <div>
              <h3 className="font-semibold mb-3">Existing Roles</h3>
              <div className="space-y-2">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-3 border rounded">
                      <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  ))
                ) : (
                  roles.map((role) => {
                    const isDefaultRole = Object.values(DefaulRoleEnum).includes(
                      role.fullname.toLowerCase() as DefaulRoleEnum
                    );
                    return (
                      <div
                        key={role.id}
                        className={`p-3 border rounded ${
                          !isDefaultRole ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                        } ${
                          selectedRole?.id === role.id
                            ? 'bg-blue-100 border-blue-500'
                            : !isDefaultRole
                            ? 'hover:bg-gray-50'
                            : ''
                        }`}
                        onClick={() => {
                          if (!isDefaultRole) {
                            setSelectedRole(role);
                            setNewRoleName(role.name);
                            const rolePermIds = role.permissions?.map((perm: any) => 
                              perm.permission ? perm.permission.id : perm.id
                            ) || [];
                            setSelectedPermissions(rolePermIds);
                          }
                        }}
                      >
                        <div>
                          <div className="font-medium">
                            {role.name}{' '}
                            {isDefaultRole && (
                              <span className="text-xs text-gray-500">(Protected)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {role.permissions?.length || 0} permissions
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Permissions Tab */}
        {activeTab === 'permissions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Create New Permission</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Permission name (e.g., custom_permission)"
                  value={newPermissionName}
                  onChange={(e) => setNewPermissionName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <button
                  onClick={handleCreatePermission}
                  className="btn-primary w-full"
                >
                  Create Permission
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Existing Permissions</h3>
              <div className="max-h-60 overflow-y-auto">
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-2 border-b flex justify-between items-center">
                      <div className="h-4 bg-gray-200 rounded animate-pulse flex-1 mr-4"></div>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))
                ) : (
                  permissions.map((perm) => {
                    const isDefaultPermission = Object.values(DefaultPermissionEnum).includes(
                      perm.name as DefaultPermissionEnum
                    );
                    return (
                      <div
                        key={perm.id}
                        className={`p-2 border-b flex justify-between items-center ${
                          isDefaultPermission ? 'bg-gray-50' : ''
                        }`}
                      >
                        <span className="text-sm">
                          {perm.name}{' '}
                          {isDefaultPermission && (
                            <span className="text-xs text-gray-500">(Protected)</span>
                          )}
                        </span>
                        {!isDefaultPermission && (
                          <button className="text-red-600 text-xs hover:text-red-800">Delete</button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assign Roles Tab */}
      </div>
    </div>
  );
}
// {activeTab === 'assign' && (
//   <div className="space-y-6">
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div>
//         <label className="block text-sm font-medium mb-2">Select User</label>
//         <select
//           value={selectedUserId || ''}
//           onChange={(e) => setSelectedUserId(Number(e.target.value) || null)}
//           className="w-full border rounded px-3 py-2"
//         >
//           <option value="">Choose user...</option>
//           {users.map((user) => (
//             <option key={user.id} value={user.id}>
//               {user.username} ({user.role?.name || 'No role'})
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label className="block text-sm font-medium mb-2">Select Role</label>
//         <select
//           value={selectedRoleId || ''}
//           onChange={(e) => setSelectedRoleId(Number(e.target.value) || null)}
//           className="w-full border rounded px-3 py-2"
//         >
//           <option value="">Choose role...</option>
//           {roles.map((role) => (
//             <option key={role.id} value={role.id}>
//               {role.name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>

//     <button
//       onClick={handleAssignRole}
//       disabled={!selectedUserId || !selectedRoleId}
//       className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
//     >
//       Assign Role to User
//     </button>

//     {/* Current User Roles */}
//     <div>
//       <h3 className="font-semibold mb-3">Current User Roles</h3>
//       <div className="overflow-x-auto">
//         <table className="min-w-full border">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="border px-4 py-2 text-left">User</th>
//               <th className="border px-4 py-2 text-left">Role</th>
//               <th className="border px-4 py-2 text-left">Permissions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id}>
//                 <td className="border px-4 py-2">{user.username}</td>
//                 <td className="border px-4 py-2">{user.role?.name || 'No role'}</td>
//                 <td className="border px-4 py-2 text-sm">
//                   {user.role?.permissions?.length || 0} permissions
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// )}
