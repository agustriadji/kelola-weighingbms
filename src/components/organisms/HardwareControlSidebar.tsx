'use client';

import GateControl from './GateControl';
import CCTVControl from './CCTVControl';
import RejectDocumentControl from './RejectDocumentControl';

export default function HardwareControlSidebar() {
  return (
    <div className="top-20 right-0 bottom-0 min-w-64 max-w-64 w-64 bg-cyan-200 rounded-lg shadow-md border-gray-400 ">
      <div className="flex flex-col">
        <div className="p-4 border-b border-gray-400">
          <h3 className="text-sm font-semibold text-gray-800">Device Control</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-4">
          {/* Gate Control */}
          <GateControl />

          {/* CCTV Capture */}
          <CCTVControl />

          {/* Reject Document Control */}
          <RejectDocumentControl />

          {/* Future controls can be added here */}
        </div>
      </div>
    </div>
  );
}
