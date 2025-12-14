'use client';

interface SkeletonLoaderProps {
  type?: 'card' | 'table' | 'form' | 'text' | 'custom';
  rows?: number;
  height?: string;
  className?: string;
}

export default function SkeletonLoader({ 
  type = 'card', 
  rows = 3, 
  height = 'h-4',
  className = '' 
}: SkeletonLoaderProps) {
  
  if (type === 'card') {
    return (
      <div className={`animate-pulse p-4 bg-white rounded-lg shadow ${className}`}>
        <div className="skeleton h-6 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="skeleton h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="skeleton h-10 bg-gray-200 rounded mb-2"></div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="skeleton h-8 bg-gray-100 rounded mb-1"></div>
        ))}
      </div>
    );
  }

  if (type === 'form') {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i}>
            <div className="skeleton h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="skeleton h-10 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`animate-pulse space-y-2 ${className}`}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={`skeleton ${height} bg-gray-200 rounded`}></div>
        ))}
      </div>
    );
  }

  // Custom skeleton
  return (
    <div className={`animate-pulse ${className}`}>
      <div className={`skeleton ${height} bg-gray-200 rounded`}></div>
    </div>
  );
}