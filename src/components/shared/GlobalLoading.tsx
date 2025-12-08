'use client';

import { useSysStore } from '@/store/sys.store';
import LoadingSpinner from './LoadingSpinner';

export default function GlobalLoading() {
  const { loadingState } = useSysStore();

  if (!loadingState) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
