'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // ✅ IMMEDIATE redirect - no delays, no localStorage blocking
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    router.replace('/dashboard');
    if (token) {
    } else {
      router.replace('/login');
    }
  }, [router]);

  // ✅ NO loading spinner, NO blocking UI
  return null;
}
