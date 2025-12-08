import { useWeighing } from '@/hooks/useWeighing';
import { DocumentWbState } from '@/types/inbound.type';
import PermissionGate from '@/components/shared/PermissionGate';
import { Permissions } from '@/types/rbac';
// import ListQueueWeighing from '../pages/Weighing/ListQueueWeighing.page';
// import ListQueueYard from '../pages/Weighing/ListQueueYard.page';

export default function MenuListWeighingTemplate() {
  const { activeListWeighingState, setActiveListWeighingState } = useWeighing();
  // const [active, setActive] = useState('');

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex mb-6 space-x-2 text-sm">
          <PermissionGate permissions={[Permissions.CREATE_WEIGHING]}>
            <button
              className={`px-4 py-2 border border-gray-400 ${
                activeListWeighingState === 'weighing'
                  ? 'bg-gray-200 border-gray-600'
                  : 'bg-white hover:bg-gray-300'
              } `}
              onClick={() => setActiveListWeighingState('weighing')}
            >
              Weighing
            </button>
          </PermissionGate>
          <PermissionGate permissions={[Permissions.CREATE_WEIGHING, Permissions.POS_WEIGHINGIN]}>
            <button
              className={`px-4 py-2 border border-gray-400 ${
                activeListWeighingState === DocumentWbState.WEIGHING_QUEUE
                  ? 'bg-gray-200 border-gray-600'
                  : 'bg-white hover:bg-gray-300'
              } `}
              onClick={() => setActiveListWeighingState(DocumentWbState.WEIGHING_QUEUE)}
            >
              List Truck Parkir
            </button>
          </PermissionGate>
          <PermissionGate permissions={[Permissions.POS_WEIGHINGOUT]}>
            <button
              className={`px-4 py-2 border border-gray-400 ${
                activeListWeighingState === DocumentWbState.YARD_QUEUE
                  ? 'bg-gray-200 border-gray-600'
                  : 'bg-white hover:bg-gray-300'
              } `}
              onClick={() => setActiveListWeighingState(DocumentWbState.YARD_QUEUE)}
            >
              Truck Unloading
            </button>
          </PermissionGate>
          <button
            className={`px-4 py-2 border border-gray-400 ${
              activeListWeighingState === DocumentWbState.WB_REJECT
                ? 'bg-gray-200 border-gray-600'
                : 'bg-white hover:bg-gray-300'
            } `}
            // onClick={() => setActiveListWeighingState(DocumentWbState.WB_REJECT)}
          >
            Truck Reject
          </button>
          <PermissionGate permissions={[Permissions.POS_WEIGHINGOUT]}>
            <button
              className={`px-4 py-2 border border-gray-400 ${
                activeListWeighingState === DocumentWbState.CLOSE_WB
                  ? 'bg-gray-200 border-gray-600'
                  : 'bg-white hover:bg-gray-300'
              } `}
              onClick={() => setActiveListWeighingState(DocumentWbState.CLOSE_WB)}
            >
              Closed WB
            </button>
          </PermissionGate>
        </div>
      </div>

      {/* {active === DocumentWbState.WEIGHING_QUEUE ? (
        <ListQueueWeighing show={true} onClose={() => setActive('')} />
      ) : active === DocumentWbState.YARD_QUEUE ? (
        <ListQueueYard show={true} onClose={() => setActive('')} />
      ) : null} */}
    </>
  );
}
