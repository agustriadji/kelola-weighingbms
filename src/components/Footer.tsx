'use client'

import { useEffect, useState } from 'react'

interface LoginData {
  username: string
  filterJenis: string
  loginTime: string
}

export default function Footer() {
  const [loginData, setLoginData] = useState<LoginData | null>(null)

  useEffect(() => {
    const storedLoginData = localStorage.getItem('loginData')
    if (storedLoginData) {
      setLoginData(JSON.parse(storedLoginData))
    }
  }, [])

  const getFilterLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      'raw-material': 'RAW MATERIAL',
      'despatch': 'DESPATCH',
      'material-store': 'MATERIAL STORE'
    }
    return labels[value] || value
  }

  const getRoleFromFilter = (filterJenis: string) => {
    const roles: { [key: string]: string } = {
      'raw-material': 'Operator',
      'despatch': 'Operator', 
      'material-store': 'Operator'
    }
    return roles[filterJenis] || 'Operator'
  }

  if (!loginData) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-300 px-4 py-2">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span>User :</span>
            <span className="font-medium">{loginData.username}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Role :</span>
            <span className="font-medium">{getRoleFromFilter(loginData.filterJenis)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Operation :</span>
            <span className="font-medium">{getFilterLabel(loginData.filterJenis)}</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Login: {new Date(loginData.loginTime).toLocaleString('id-ID')}
        </div>
      </div>
    </div>
  )
}