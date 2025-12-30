'use client';

import { useState } from 'react';

export default function LampControl() {
  const [isCapturing, setIsCapturing] = useState(true);

  const handleTurnOn = async () => {
    setIsCapturing(!isCapturing);

    // Simulate Lamp
    alert(`Lamp Turn ${!isCapturing ? 'Off' : 'On'}!`);
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm">
      <h4 className="font-semibold text-sm text-purple-800 mb-3">Lamp Control</h4>
      <button
        onClick={handleTurnOn}
        className={`w-full px-4 py-2 rounded font-medium transition-colors bg-purple-600 hover:bg-purple-700 text-white`}
      >
        {isCapturing ? 'Turn on' : 'Turn off'}
      </button>
    </div>
  );
}
