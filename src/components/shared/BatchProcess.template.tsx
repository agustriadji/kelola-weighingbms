import PermissionGate from '@/components/shared/PermissionGate';
import { Permissions } from '@/types/rbac';
import { useWeighing } from '@/hooks/useWeighing';
import { InboundStatus } from '@/types/inbound.type';

export default function WeighingInfoTemplate() {
  const {
    // State
    currentTime,
    suppliers,
    materials,
    vehicles,
    currentBatch,
    currentWeight,
    isStable,
    brutoWeight,
    tarraWeight,
    nettoWeight,
    formData,
    shrinkageData,

    // Actions
    createBatch,
    startBatch,
    endBatch,
    saveWeightRecordState,
    setFormData,
  } = useWeighing();

  const handleCreateBatch = async () => {
    const success = await createBatch();
    if (!success) {
      alert('Failed to create batch');
    }
  };

  const handleStartBatch = async () => {
    if (!currentBatch) return;
    const success = await startBatch(currentBatch.inbound.id);
    if (!success) {
      alert('Failed to start batch');
    }
  };

  const handleEndBatch = async () => {
    if (!currentBatch) return;
    const success = await saveWeightRecordState(brutoWeight, isStable);
    if (!success) {
      alert('Failed');
    }
  };
  const data = {
    outStandingContract: 1480000,
    totalBrutto: '-10 Kg',
    totalShrinkage: '-0.02 %',
  };
  return (
    <>
      <PermissionGate permission={Permissions.CREATE_WEIGHING}>
        <div className="pt-4">
          {currentBatch?.warningFlag && (
            <div
              className={`p-4 rounded border-2 mb-4 ${
                currentBatch.inbound.status === InboundStatus.QUEUE_IN
                  ? 'bg-yellow-100 border-yellow-400'
                  : currentBatch.inbound.status === InboundStatus.WEIGHING_IN
                  ? 'bg-green-100 border-green-400'
                  : 'bg-gray-100 border-gray-400'
              }`}
            >
              <div className="text-center">
                <div
                  className={`text-xl font-bold mt-2 ${
                    currentBatch.inbound.status === InboundStatus.QUEUE_IN
                      ? 'text-yellow-600'
                      : currentBatch.inbound.status === InboundStatus.WEIGHING_IN
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}
                >
                  {currentBatch.warningFlag && (
                    <div className="text-red-600 font-bold mt-2">
                      ⚠️ SHRINKAGE WARNING: {currentBatch.shrinkagePercent?.toFixed(2)}%
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentBatch?.inbound?.status === InboundStatus.WEIGHING_IN ? (
            <button
              onClick={handleEndBatch}
              className="w-full bg-green-600 py-3 text-lg font-semibold border border-gray-500 text-white"
            >
              START WEIGHING BRUTTO
            </button>
          ) : currentBatch?.inbound.status === InboundStatus.WEIGHING_OUT ? (
            <button
              onClick={handleEndBatch}
              className="w-full bg-green-400 py-3 text-lg font-semibold border border-gray-500 text-white"
            >
              START WEIGHING TARRA
            </button>
          ) : (
            <></>
          )}
        </div>
      </PermissionGate>

      {/* Weight Capture Status */}
      {/* {currentBatch?.inbound.status === InboundStatus.WEIGHING_IN && (
        <div className="bg-blue-100 border-2 border-blue-400 p-3 rounded">
          <div className="text-center">
            <div className="text-sm font-bold text-blue-800">WEIGHT CAPTURE STATUS</div>
            <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
              <div
                className={`p-2 rounded ${
                  brutoWeight > 0 ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                }`}
              >
                BRUTO: {brutoWeight || 'Waiting...'}
              </div>
              <div
                className={`p-2 rounded ${
                  tarraWeight > 0 ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                }`}
              >
                TARRA: {tarraWeight || 'Waiting...'}
              </div>
              <div
                className={`p-2 rounded ${
                  nettoWeight > 0 ? 'bg-green-200 text-green-800' : 'bg-gray-200'
                }`}
              >
                NETTO: {nettoWeight || 'Waiting...'}
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Shrinkage Display */}
      {/* {shrinkageData && (
        <div
          className={`p-4 rounded border-2 ${
            shrinkageData.warning ? 'bg-red-100 border-red-400' : 'bg-green-100 border-green-400'
          }`}
        >
          <div className="text-center">
            <div className="text-lg font-bold">SHRINKAGE ANALYSIS</div>
            <div className="text-sm mt-2">Value: {shrinkageData.shrinkageValue.toFixed(2)} Kg</div>
            <div className="text-sm">Percentage: {shrinkageData.shrinkagePercent.toFixed(2)}%</div>
            <div
              className={`text-lg font-bold mt-2 ${
                shrinkageData.warning ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {shrinkageData.warning ? '⚠️ EXCEEDS THRESHOLD (>0.2%)' : '✅ WITHIN TOLERANCE'}
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
