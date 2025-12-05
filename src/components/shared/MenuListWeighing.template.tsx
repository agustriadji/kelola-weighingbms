import { useWeighing } from '@/hooks/useWeighing';
import { useState } from 'react';
import { DocumentWbState } from '@/types/inbound.type';
import ListQueueWeighing from '../pages/Weighing/ListQueueWeighing.page';
import ListQueueYard from '../pages/Weighing/ListQueueYard.page';

export default function MenuListWeighingTemplate() {
  const [active, setActive] = useState('');

  return (
    <>
      <div className="flex mb-6">
        <button
          className="px-4 py-2 border border-gray-400 bg-gray-200"
          onClick={() => setActive(DocumentWbState.WEIGHING_QUEUE)}
        >
          List Truck Parkir
        </button>
        <button
          className="px-4 py-2 border border-gray-400 bg-white"
          onClick={() => setActive(DocumentWbState.YARD_QUEUE)}
        >
          Truck Unloading
        </button>
        <button
          className="px-4 py-2 border border-gray-400 bg-white"
          onClick={() => setActive(DocumentWbState.WB_REJECT)}
        >
          Truck Reject
        </button>
        <button
          className="px-4 py-2 border border-gray-400 bg-white"
          onClick={() => setActive(DocumentWbState.CLOSE_WB)}
        >
          Closed WB
        </button>
      </div>

      {active === DocumentWbState.WEIGHING_QUEUE ? (
        <ListQueueWeighing show={true} onClose={() => setActive('')} />
      ) : active === DocumentWbState.YARD_QUEUE ? (
        <ListQueueYard show={true} onClose={() => setActive('')} />
      ) : null}
    </>
  );
}
