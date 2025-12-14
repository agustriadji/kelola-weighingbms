'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function Home() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Add small delay for smoother transition
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [router]);

  if (!isChecking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="flex flex-col items-center gap-4 p-8">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-blue-200 rounded-full mb-4"></div>
        </div>
        <LoadingSpinner size="lg" text="Initializing application..." />
        <p className="text-sm text-gray-500 animate-fade-in">Please wait while we prepare your workspace</p>
      </div>
    </div>
  );
}
