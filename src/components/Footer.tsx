'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface LoginData {
  username: string;
  filterJenis: string;
  loginTime?: string;
}

export default function Footer() {
  const [loginData, setLoginData] = useState<LoginData | null>(null);
  const [loginTime, setLoginTime] = useState<string>('');
  const { user } = useAuth();

  useEffect(() => {
    const storedLoginData = localStorage.getItem('loginData');
    if (storedLoginData) {
      setLoginData(JSON.parse(storedLoginData));
    }

    // Set login time to current time if not exists
    const currentTime = new Date().toLocaleString('en-US');
    setLoginTime(currentTime);
  }, []);

  const getFilterLabel = (value: string) => {
    const labels: { [key: string]: string } = {
      'raw-material': 'RAW MATERIAL',
      despatch: 'DESPATCH',
      'material-store': 'MATERIAL STORE',
    };
    return labels[value] || value;
  };

  if (!loginData || !user) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-200 border-t border-gray-300 px-4 py-2">
      <div className="flex items-center justify-between text-sm text-gray-700">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span>User :</span>
            <span className="font-medium">{user.username}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>

          <div className="flex items-center space-x-2">
            <span>Role :</span>
            <span className="font-medium">{user.role}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500">Login: {loginTime}</div>
      </div>
    </div>
  );
}
