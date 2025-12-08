'use client';

import { useSysStore } from '@/store/sys.store';
import { RegisterDocType, RegisterDocTypeName } from '@/types/inbound.type';

export default function MenuHeaderRegisterDocPage() {
  const { activeMenuState, setActiveMenuState } = useSysStore();

  return (
    <div className="p-6 space-y-6">
      <div className="flex mb-6 space-x-2 text-sm">
        <button
          className={`px-4 py-2 border border-gray-400 ${
            activeMenuState === RegisterDocType.RAW_MATERIAL
              ? 'bg-gray-200 border-gray-600'
              : 'bg-white hover:bg-gray-300'
          } `}
          onClick={() => setActiveMenuState(RegisterDocType.RAW_MATERIAL)}
        >
          {RegisterDocTypeName.RAW_MATERIAL}
        </button>
        <button
          className={`px-4 py-2 border border-gray-400 ${
            activeMenuState === RegisterDocType.DISPATCH
              ? 'bg-gray-200 border-gray-600'
              : 'bg-white hover:bg-gray-300'
          } `}
          onClick={() => setActiveMenuState(RegisterDocType.DISPATCH)}
        >
          {RegisterDocTypeName.DISPATCH}
        </button>
        <button
          className={`px-4 py-2 border border-gray-400 ${
            activeMenuState === RegisterDocType.MISCELLANEOUS
              ? 'bg-gray-200 border-gray-600'
              : 'bg-white hover:bg-gray-300'
          } `}
          onClick={() => setActiveMenuState(RegisterDocType.MISCELLANEOUS)}
        >
          {RegisterDocTypeName.MISCELLANEOUS}
        </button>
      </div>
    </div>
  );
}
