'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [filterJenis, setFilterJenis] = useState('')
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // const filterOptions = [
  //   { value: 'raw-material', label: 'RAW MATERIAL (INCOMING)' },
  //   { value: 'despatch', label: 'DESPATCH (OUTGOING)' },
  //   { value: 'material-store', label: 'MATERIAL STORE (MISCELLANEOUS)' }
  // ]

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem(
          'loginData',
          JSON.stringify({
            username,
            loginTime: new Date().toISOString(),
          })
        );

        if (result.user.permissions.length) {
          if (result.user.role === 'Operator_Registering') {
            router.push('/pos-one');
          } else {
            router.push('/dashboard');
          }
        }
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Evyap" width={100} height={50} className="mx-auto mb-2" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Default Users Info */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Default Users:</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div>
              <strong>admin</strong> / admin123 (Full Access)
            </div>
            {/* <div>
              <strong>supervisor</strong> / super123 (Supervisor)
            </div> */}
            <div>
              <strong>operator_weighing_in</strong> / oper123 (Operator Weighing IN)
            </div>
            <div>
              <strong>operator_weighing_out</strong> / oper123 (Operator Weighing OUT)
            </div>
            <div>
              <strong>operator_registering</strong> / oper123 (Operator Registering)
            </div>
            {/* <div>
              <strong>viewer</strong> / view123 (View Only)
            </div> */}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          {/* Filter Jenis */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Type</label>
            <select
              value={filterJenis}
              onChange={(e) => setFilterJenis(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Filter Type</option>
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}
