'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [filterJenis, setFilterJenis] = useState('')
  const router = useRouter()

  const filterOptions = [
    { value: 'raw-material', label: 'RAW MATERIAL (INCOMING)' },
    { value: 'despatch', label: 'DESPATCH (OUTGOING)' },
    { value: 'material-store', label: 'MATERIAL STORE (MISCELLANEOUS)' }
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password || !filterJenis) {
      alert('Silakan lengkapi semua field')
      return
    }

    // Simpan data ke localStorage
    const loginData = {
      username,
      password,
      filterJenis,
      loginTime: new Date().toISOString()
    }
    
    localStorage.setItem('loginData', JSON.stringify(loginData))
    localStorage.setItem('isLoggedIn', 'true')
    
    // Redirect ke dashboard
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Evyap</h1>
          <div className="flex items-center justify-center">
            <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <div className="w-4 h-4 bg-green-400 rounded-full mr-2"></div>
              Life Chemistry
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan password"
            />
          </div>

          {/* Filter Jenis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter Jenis
            </label>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Pilih Filter Jenis</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200 font-medium"
          >
            LOGIN
          </button>
        </form>
      </div>
    </div>
  )
}