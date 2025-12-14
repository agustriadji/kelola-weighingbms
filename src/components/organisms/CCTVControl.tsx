'use client';

import { useState } from 'react';

export default function CCTVControl() {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = async () => {
    setIsCapturing(true);

    // Simulate CCTV capture
    setTimeout(() => {
      setIsCapturing(false);
      alert('CCTV Screenshot captured successfully!');
    }, 2000);
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
      <h4 className="font-semibold text-sm text-purple-800 mb-3">CCTV Control</h4>
      <button
        onClick={handleCapture}
        disabled={isCapturing}
        className={`w-full px-4 py-2 rounded font-medium transition-colors ${
          isCapturing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        }`}
      >
        {isCapturing ? 'Capturing...' : 'Capture'}
      </button>
    </div>
  );
}
