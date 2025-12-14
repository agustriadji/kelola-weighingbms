'use client';

import { Suspense, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';
import SkeletonLoader from './SkeletonLoader';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  height?: string;
  text?: string;
  skeleton?: boolean;
  skeletonType?: 'card' | 'table' | 'form' | 'text' | 'custom';
  skeletonRows?: number;
}

export default function LazyWrapper({ 
  children, 
  fallback, 
  height = 'h-32', 
  text,
  skeleton = false,
  skeletonType = 'card',
  skeletonRows = 3
}: LazyWrapperProps) {
  const defaultFallback = skeleton ? (
    <SkeletonLoader type={skeletonType} rows={skeletonRows} height={height} />
  ) : (
    <div className={`${height} flex items-center justify-center animate-fade-in`}>
      <LoadingSpinner size="md" text={text} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div className="animate-fade-in">
        {children}
      </div>
    </Suspense>
  );
}

// HOC for lazy loading components
export function withLazyLoading<T extends object>(
  Component: ComponentType<T>,
  options: {
    height?: string;
    text?: string;
    skeleton?: boolean;
    skeletonType?: 'card' | 'table' | 'form' | 'text' | 'custom';
    skeletonRows?: number;
  } = {}
) {
  return function LazyComponent(props: T) {
    return (
      <LazyWrapper 
        height={options.height || 'h-32'} 
        text={options.text}
        skeleton={options.skeleton}
        skeletonType={options.skeletonType}
        skeletonRows={options.skeletonRows}
      >
        <Component {...props} />
      </LazyWrapper>
    );
  };
}