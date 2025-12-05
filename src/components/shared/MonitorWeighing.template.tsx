import { useWeighing } from '@/hooks/useWeighing';
import { InboundStatus } from '@/types/inbound.type';

export default function MonitorWeighingTemplate({ data }: { data: any } | undefined) {
  const {
    // State
    currentWeight,
    isStable,
    brutoWeight,
    tarraWeight,
    nettoWeight,
    currentBatch,
    batchId,
  } = useWeighing();
  const { inbound, document } = currentBatch || {};

  data = {
    outStandingContract: 1480000,
    totalBrutto: '-10 Kg',
    totalShrinkage: '-0.02 %',
  };
  return (
    <div className="bg-blue-100 p-2 mb-6 border rounded-md border-gray-400">
      <div className="flex gap-4 items-start">
        {/* Vehicle Number */}
        <div className="flex-shrink-0 w-48">
          <div className="bg-white p-6 text-center border-2 rounded-md border-black h-32 flex flex-col">
            <textarea
              className="bg-white w-full flex-grow text-3xl text-center lg:text-3xl font-bold resize-none"
              disabled={true}
              value={document?.vehicleNumber || 'No. Police'}
            />
          </div>

          {/* <button className="w-full bg-gray-300 py-2 border border-gray-400 mt-2 text-sm">
            Refresh
          </button> */}
        </div>

        {/* Weight Display */}
        <div className="flex-1  min-w-0">
          <div className="grid grid-cols-3 border-2 rounded-md border-black bg-white overflow-hidden h-32">
            <div className="flex flex-col p-1 border-black overflow-hidden h-32 border-r">
              <label className="text-green-600 text-lg font-bold mb-1">W-IN</label>
              <textarea
                className="flex-grow min-h-0 w-full p-2 text-5xl text-center lg:text-5xl font-bold resize-none"
                value={
                  inbound?.status === InboundStatus.WEIGHING_IN
                    ? currentWeight
                    : inbound?.status === InboundStatus.YARD ||
                      inbound?.status === InboundStatus.WEIGHING_OUT
                      ? tarraWeight
                      : 0
                }
              ></textarea>
            </div>

            <div className="flex flex-col p-1 border-black overflow-hidden h-32 border-r">
              <label className="text-green-600 text-lg font-bold mb-1">W-OUT</label>
              <textarea
                className="flex-grow min-h-0 w-full p-2 text-5xl text-center lg:text-5xl font-bold resize-none"
                value={
                  inbound?.status === InboundStatus.WEIGHING_OUT
                    ? currentWeight
                    : inbound?.status === InboundStatus.FINISHED
                      ? tarraWeight
                      : 0
                }
              ></textarea>
            </div>

            <div className="flex flex-col p-1 border-black overflow-hidden h-32">
              <label className="text-green-600 text-lg font-bold mb-1">W-NET</label>
              <textarea
                className="flex-grow min-h-0 w-full p-2 text-5xl text-center lg:text-5xl font-bold resize-none"
                value={inbound?.status === InboundStatus.FINISHED ? tarraWeight : 0}
              />
            </div>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex flex-col items-center space-y-2">
          {/* Outstanding Contract */}
          <div className="text-center">
            <div className="font-semibold text-sm">Outstanding Contract</div>
            <div className="border border-black px-6 py-1 mt-1 bg-white font-bold text-lg">
              {data.outStandingContract}
            </div>
          </div>

          {/* Susut / Gain Brutto */}
          <div className="text-center">
            <div className="font-semibold text-sm mb-1">Susut/Gain Brutto</div>

            <div className="flex gap-2 justify-center">
              <div className="border border-black px-4 py-1 bg-white text-sm font-medium">
                {data.totalBrutto}
              </div>
              <div className="border border-black px-4 py-1 bg-white text-sm font-medium">
                {data.totalShrinkage}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
