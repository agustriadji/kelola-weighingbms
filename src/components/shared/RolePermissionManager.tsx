'use client'

import { useState, useEffect } from 'react'

interface RolePermissionManagerProps {
  onClose: () => void
}

export default function RolePermissionManager({ onClose }: RolePermissionManagerProps) {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'assign'>('roles')
  const [roles, setRoles] = useState<any[]>([])
  const [permissions, setPermissions] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedRole, setSelectedRole] = useState<any | null>(null)
  
  const [newRoleName, setNewRoleName] = useState('')
  const [newPermissionName, setNewPermissionName] = useState('')
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [rolesRes, permsRes, usersRes] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/permissions'),
        fetch('/api/users')
      ])
      
      const [rolesData, permsData, usersData] = await Promise.all([
        rolesRes.json(),
        permsRes.json(),
        usersRes.json()
      ])
      
      if (rolesData.roles) setRoles(rolesData.roles)
      if (permsData.permissions) setPermissions(permsData.permissions)
      if (usersData.users) setUsers(usersData.users)
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const handleCreateRole = async () => {
    if (!newRoleName.trim()) return
    
    try {
      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newRoleName, permissionIds: selectedPermissions })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('Role created successfully')
        setNewRoleName('')
        setSelectedPermissions([])
        loadData()
      } else {
        alert(result.error || 'Failed to create role')
      }
    } catch (error) {
      console.error('Error creating role:', error)
      alert('Error creating role')
    }
  }

  const handleCreatePermission = async () => {
    if (!newPermissionName.trim()) return
    // TODO: Implement API call to create permission
    console.log('TODO: Create permission via API')
  }

  const handleAssignRole = async () => {
    if (!selectedUserId || !selectedRoleId) return
    // TODO: Implement API call to assign role
    console.log('TODO: Assign role via API')
  }

  const handleUpdateRolePermissions = async () => {
    if (!selectedRole) return
    
    try {
      const response = await fetch('/api/roles/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: selectedRole.id, permissionIds: selectedPermissions })
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('Role permissions updated successfully')
        loadData()
      } else {
        alert(result.error || 'Failed to update role permissions')
      }
    } catch (error) {
      console.error('Error updating role permissions:', error)
      alert('Error updating role permissions')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Role & Permission Management</h2>
          
          {/* Tabs */}
          <div className="flex border-b">
            {[
              { key: 'roles', label: 'Roles' },
              { key: 'permissions', label: 'Permissions' },
              { key: 'assign', label: 'Assign Roles' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-4 py-2 ${
                  activeTab === tab.key
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* Roles Tab */}
        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Role */}
            <div>
              <h3 className="font-semibold mb-3">Create New Role</h3>
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
                    {permissions.map(perm => (
                      <label key={perm.id} className="flex items-center space-x-2 mb-1">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions([...selectedPermissions, perm.id])
                            } else {
                              setSelectedPermissions(selectedPermissions.filter(id => id !== perm.id))
                            }
                          }}
                        />
                        <span className="text-sm">{perm.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateRole}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Create Role
                </button>
              </div>
            </div>

            {/* Existing Roles */}
            <div>
              <h3 className="font-semibold mb-3">Existing Roles</h3>
              <div className="space-y-2">
                {roles.map(role => (
                  <div
                    key={role.id}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedRole?.id === role.id ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedRole(role)
                      const rolePermIds = role.permissions?.map((rp: any) => rp.permission.id) || []
                      setSelectedPermissions(rolePermIds)
                    }}
                  >
                    <div className="font-medium">{role.name}</div>
                    <div className="text-sm text-gray-600">
                      {role.permissions?.length || 0} permissions
                    </div>
                  </div>
                ))}
              </div>

              {selectedRole && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Update {selectedRole.name} Permissions</h4>
                  <button
                    onClick={handleUpdateRolePermissions}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Update Permissions
                  </button>
                </div>
              )}
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
                  placeholder="Permission name (e.g., view_reports)"
                  value={newPermissionName}
                  onChange={(e) => setNewPermissionName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <button
                  onClick={handleCreatePermission}
                  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Create Permission
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Existing Permissions</h3>
              <div className="max-h-60 overflow-y-auto">
                {permissions.map(perm => (
                  <div key={perm.id} className="p-2 border-b">
                    <span className="text-sm">{perm.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assign Roles Tab */}
        {activeTab === 'assign' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select
                  value={selectedUserId || ''}
                  onChange={(e) => setSelectedUserId(Number(e.target.value) || null)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Choose user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.username} ({user.role?.name || 'No role'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Role</label>
                <select
                  value={selectedRoleId || ''}
                  onChange={(e) => setSelectedRoleId(Number(e.target.value) || null)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Choose role...</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAssignRole}
              disabled={!selectedUserId || !selectedRoleId}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              Assign Role to User
            </button>

            {/* Current User Roles */}
            <div>
              <h3 className="font-semibold mb-3">Current User Roles</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="border px-4 py-2 text-left">User</th>
                      <th className="border px-4 py-2 text-left">Role</th>
                      <th className="border px-4 py-2 text-left">Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="border px-4 py-2">{user.username}</td>
                        <td className="border px-4 py-2">{user.role?.name || 'No role'}</td>
                        <td className="border px-4 py-2 text-sm">
                          {user.role?.permissions?.length || 0} permissions
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}