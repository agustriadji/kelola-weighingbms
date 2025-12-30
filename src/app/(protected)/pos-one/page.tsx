'use client';

import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

import Pos1Page from '@/components/pages/PosRegistering/Registering.page';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" text="Loading POS registration..." />
        </div>
      }
    >
      <Pos1Page />
    </Suspense>
  );
}
