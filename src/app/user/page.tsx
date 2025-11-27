'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import ProtectedRoute from '@/components/ProtectedRoute'
import PermissionGate from '@/components/PermissionGate'
import RolePermissionManager from '@/components/RolePermissionManager'
import { useAuth } from '@/hooks/useAuth'
import { Permissions } from '@/types/rbac'


interface User {
  id: number
  username: string
  fullName: string
  role: {
    id: number
    name: string
  }
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [showRoleManager, setShowRoleManager] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    roleName: 'Admin'
  })
  const router = useRouter()
  const { user, logout: authLogout } = useAuth()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    loadUsers()
  }, [router])

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({ ...formData, password })
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const result = await response.json()
      if (result.users) {
        setUsers(result.users)
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      
      if (response.ok) {
        alert('User created successfully')
        setFormData({ username: '', password: '', fullName: '', roleName: 'Admin' })
        loadUsers()
      } else {
        alert(result.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('An error occurred while creating user')
    }
  }

  const handleLogout = () => {
    authLogout()
    router.push('/login')
  }

  return (
    <ProtectedRoute requiredPermission={Permissions.VIEW_USERS}>
      <div className="min-h-screen bg-gray-100">
      {/* Topbar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">Evyap</h1>
              <div className="ml-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs">
                Life Chemistry
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md"
              >
                Dashboard
              </button>
              <button className="bg-blue-600 text-white px-3 py-2 rounded-md">
                User
              </button>
              <PermissionGate permission={Permissions.MANAGE_SYSTEM}>
                <button
                  onClick={() => setShowRoleManager(true)}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md transition duration-200"
                >
                  Roles
                </button>
              </PermissionGate>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Form User */}
        <PermissionGate permission={Permissions.CREATE_USERS}>
          <div className="bg-white rounded-lg shadow-md p-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add User</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="bg-blue-600 text-white px-3 py-2 rounded-r-md hover:bg-blue-700"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={formData.roleName}
                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Admin">Admin</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Operator">Operator</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
Save User
              </button>
            </div>
          </form>
          </div>
        </PermissionGate>

        {/* Table List User */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">User List</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Username</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Full Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
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
                      <td className="px-4 py-2 text-sm text-gray-900">{user.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{user.username}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{user.fullName}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{user.role.name}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
      
      {showRoleManager && (
        <RolePermissionManager onClose={() => setShowRoleManager(false)} />
      )}
      </div>
    </ProtectedRoute>
  )
}