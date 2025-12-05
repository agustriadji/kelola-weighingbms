'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingIcon from '@/components/templates/LoadingIcon';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingIcon />
        <p className="text-center text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
