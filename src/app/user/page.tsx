'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addUser, getAllUsers } from '@/utils/storage'
import Footer from '@/components/Footer'

interface User {
  id?: number
  username: string
  password: string
  role: string
  nik: string
  createdAt: string
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([])
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Admin',
    nik: ''
  })
  const router = useRouter()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (!isLoggedIn) {
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
      const allUsers = await getAllUsers()
      setUsers(allUsers)
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username || !formData.password || !formData.nik) {
      alert('Silakan lengkapi semua field')
      return
    }

    const userData: User = {
      ...formData,
      createdAt: new Date().toISOString()
    }

    const success = await addUser(userData)
    
    if (success) {
      alert('User berhasil ditambahkan')
      setFormData({ username: '', password: '', role: 'Admin', nik: '' })
      loadUsers()
    } else {
      alert('Gagal menambahkan user')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loginData')
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  }

  return (
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Tambah User</h2>
          
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
                placeholder="Masukkan username"
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
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK
              </label>
              <input
                type="text"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan NIK"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
              >
                Simpan User
              </button>
            </div>
          </form>
        </div>

        {/* Table List User */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">List User</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Username</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Password</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Role</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">NIK</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                      Belum ada data user
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-2 text-sm text-gray-900">{user.id}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{user.username}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{user.password}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{user.role}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{user.nik}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}