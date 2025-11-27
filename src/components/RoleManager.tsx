'use client'

import { useState } from 'react'
import { Permissions, Roles } from '@/types/rbac'

interface RoleManagerProps {
  onClose: () => void
}

export default function RoleManager({ onClose }: RoleManagerProps) {
  const [selectedRole, setSelectedRole] = useState<string>(Roles.OPERATOR)
  
  const rolePermissions = {
    [Roles.ADMIN]: Object.values(Permissions),
    [Roles.SUPERVISOR]: [
      Permissions.VIEW_DASHBOARD,
      Permissions.VIEW_WEIGHING,
      Permissions.CREATE_WEIGHING,
      Permissions.UPDATE_WEIGHING,
      Permissions.VIEW_USERS,
      Permissions.VIEW_REPORTS,
      Permissions.EXPORT_REPORTS,
    ],
    [Roles.OPERATOR]: [
      Permissions.VIEW_DASHBOARD,
      Permissions.VIEW_WEIGHING,
      Permissions.CREATE_WEIGHING,
      Permissions.UPDATE_WEIGHING,
    ],
    [Roles.VIEWER]: [
      Permissions.VIEW_DASHBOARD,
      Permissions.VIEW_WEIGHING,
      Permissions.VIEW_REPORTS,
    ]
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Role & Permission Manager</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Selection */}
          <div>
            <h3 className="font-semibold mb-3">Roles</h3>
            <div className="space-y-2">
              {Object.values(Roles).map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-3 rounded border ${
                    selectedRole === role
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h3 className="font-semibold mb-3">Permissions for {selectedRole}</h3>
            <div className="space-y-2">
              {Object.values(Permissions).map((permission) => {
                const hasPermission = rolePermissions[selectedRole as keyof typeof rolePermissions]?.includes(permission)
                return (
                  <div
                    key={permission}
                    className={`p-2 rounded text-sm ${
                      hasPermission
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {hasPermission ? '✓' : '✗'} {permission.replace(/_/g, ' ').toUpperCase()}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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