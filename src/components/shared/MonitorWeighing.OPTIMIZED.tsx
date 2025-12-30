import { useMemo } from 'react';
import { useWeighingStore } from '@/store/weighing.store';
import { InboundStatus } from '@/types/inbound.type';

export default function MonitorWeighingOptimized({ data }: { data: any } | undefined) {
  // ✅ SELECTIVE subscriptions - only what's needed
  const currentWeight = useWeighingStore(state => state.currentWeight);
  const captureWeight = useWeighingStore(state => state.captureWeight);
  const isCaptureWeight = useWeighingStore(state => state.isCaptureWeight);
  const currentBatch = useWeighingStore(state => state.currentBatch);

  const { inbound, document } = currentBatch || {};

  // ✅ MEMOIZED calculations
  const valueWIN = useMemo(() => {
    if (inbound?.weighIn?.weight) return inbound.weighIn.weight;
    if (inbound?.status === InboundStatus.WEIGHING_IN) {
      return isCaptureWeight ? captureWeight : currentWeight;
    }
    return 0;
  }, [inbound?.weighIn?.weight, inbound?.status, isCaptureWeight, captureWeight, currentWeight]);

  const valueWOUT = useMemo(() => {
    if (inbound?.weighOut?.weight) return inbound.weighOut.weight;
    if (inbound?.status === InboundStatus.WEIGHING_OUT) {
      return isCaptureWeight ? captureWeight : currentWeight;
    }
    return 0;
  }, [inbound?.weighOut?.weight, inbound?.status, isCaptureWeight, captureWeight, currentWeight]);

  const valueNET = useMemo(() => {
    if (inbound?.status === InboundStatus.FINISHED && inbound?.weighOut?.netto) {
      return inbound.weighOut.netto;
    }
    if (isCaptureWeight && inbound?.weighIn?.weight) {
      if (inbound?.weighIn?.weight_type === 'BRUTTO') {
        return Number(inbound.weighIn.weight) - Number(captureWeight);
      }
      return Number(captureWeight) - Number(inbound.weighIn.weight);
    }
    return 0;
  }, [inbound?.status, inbound?.weighOut?.netto, inbound?.weighIn?.weight, inbound?.weighIn?.weight_type, isCaptureWeight, captureWeight]);

  const displayData = {
    outStandingContract: 1480000,
    totalBrutto: '-10 Kg',
    totalShrinkage: '-0.02 %',
  };

  return (
    <div className="bg-blue-100 p-2 mb-6 border rounded-md border-gray-400">
      <div className="flex gap-4 items-start">
        {/* Vehicle Number */}
        <div className="flex-shrink-0 w-48">
          <div
            className={`p-6 text-center border rounded-md border-black h-32 flex flex-col ${
              document?.vehicleNumber ? 'bg-cyan-100' : 'bg-white'
            }`}
          >
            <div className="w-full flex-grow text-3xl text-center font-bold">
              {document?.vehicleNumber || 'No. Police'}
            </div>
          </div>
        </div>

        {/* Weight Display */}
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-3 border rounded-md text-center border-black bg-white overflow-hidden h-32">
            <div
              className={`flex flex-col p-1 border-black overflow-hidden h-32 border-r ${
                inbound?.weighIn?.weight || isCaptureWeight ? 'bg-cyan-100' : 'bg-white'
              }`}
            >
              <label className="text-green-600 text-lg font-bold mb-1">W-IN</label>
              <div className="flex-grow min-h-0 w-full p-2 text-5xl text-center font-bold">
                {valueWIN}
              </div>
            </div>

            <div
              className={`flex flex-col p-1 border-black overflow-hidden h-32 border-r ${
                inbound?.status === 'weighing-out' && isCaptureWeight ? 'bg-cyan-100' : 'bg-white'
              }`}
            >
              <label className="text-green-600 text-lg font-bold mb-1">W-OUT</label>
              <div className="flex-grow min-h-0 w-full p-2 text-5xl text-center font-bold">
                {valueWOUT}
              </div>
            </div>

            <div
              className={`flex flex-col p-1 border-black overflow-hidden h-32 ${
                valueNET ? 'bg-cyan-100' : 'bg-white'
              }`}
            >
              <label className="text-green-600 text-lg font-bold mb-1">W-NET</label>
              <div className="flex-grow min-h-0 w-full p-2 text-5xl text-center font-bold">
                {valueNET}
              </div>
            </div>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-center">
            <div className="font-semibold text-sm">Outstanding Contract</div>
            <div className="border border-black px-6 py-1 mt-1 bg-white font-bold text-lg">
              {displayData.outStandingContract}
            </div>
          </div>

          <div className="text-center">
            <div className="font-semibold text-sm mb-1">Susut/Gain Brutto</div>
            <div className="flex gap-2 justify-center">
              <div className="border border-black px-4 py-1 bg-white text-sm font-medium">
                {displayData.totalBrutto}
              </div>
              <div className="border border-black px-4 py-1 bg-white text-sm font-medium">
                {displayData.totalShrinkage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
