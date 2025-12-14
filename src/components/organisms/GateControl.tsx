'use client';

import { useWeighing } from '@/hooks/useWeighing';

export default function GateControl() {
  const { gateStatus, gateProcessing, toggleGate } = useWeighing();

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
      <h4 className="font-semibold text-blue-800 mb-3">Gate Control</h4>
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-600">Status:</span>
        <span
          className={`font-medium px-1 py-1 rounded ${
            gateStatus === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {gateStatus.toUpperCase()}
        </span>
      </div>
      <button
        onClick={toggleGate}
        disabled={gateProcessing}
        className={`w-full px-2 py-2 rounded font-medium transition-colors ${
          gateProcessing
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : gateStatus === 'open'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {gateProcessing ? 'Processing...' : gateStatus === 'open' ? 'Close Gate' : 'Open Gate '}
      </button>
    </div>
  );
}
