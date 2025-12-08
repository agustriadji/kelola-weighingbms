import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function LoadingIcon() {
  return (
    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
      <LoadingSpinner size="lg" text="Loading truck data..." />
    </div>
  );
}
