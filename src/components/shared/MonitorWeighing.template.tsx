import { useWeighing } from '@/hooks/useWeighing';

export default function MonitorWeighingTemplate({ data }: { data: any } | undefined) {
  // Direct store access to avoid currentTime re-renders
  const {
    currentWeight,
    captureWeight,
    isCaptureWeight,
    isStable,
    brutoWeight,
    tarraWeight,
    nettoWeight,
    expectedNetto,
    batchId,
    currentBatch,
    InboundStatus,
  } = useWeighing();

  const { inbound, document } = currentBatch || {};

  const transactionType = inbound?.transactionType || '';
  const statusTransaction = inbound?.status || '';

  const valueWIN = () => {
    if (statusTransaction === 'weighing-out' && inbound?.weighInId && inbound?.weighOutId) {
      if (transactionType === 'DISPATCH') {
        if (inbound?.weighIn?.tarra) {
          return inbound.weighIn.tarra;
        } else {
          return 0;
        }
      } else {
        if (inbound?.weighIn?.brutto) {
          return inbound.weighIn.brutto;
        } else {
          return 0;
        }
      }
    } else {
      if (inbound?.weighIn?.weight) {
        return inbound.weighIn.weight;
      } else if (inbound?.status === InboundStatus.WEIGHING_IN) {
        if (isCaptureWeight) {
          return captureWeight;
        } else {
          return currentWeight;
        }
      } else {
        return 0;
      }
    }
  };

  const valueWOUT = () => {
    if (statusTransaction === 'weighing-out' && inbound?.weighInId && inbound?.weighOutId) {
      if (transactionType === 'DISPATCH') {
        if (inbound?.weighIn?.brutto) {
          return inbound.weighIn.brutto;
        } else {
          return 0;
        }
      } else {
        if (inbound?.weighIn?.tarra) {
          return inbound.weighIn.tarra;
        } else {
          return 0;
        }
      }
    } else {
      if (inbound?.weighOut?.weight) {
        return inbound.weighOut.weight;
      } else if (inbound?.status === InboundStatus.WEIGHING_OUT) {
        if (isCaptureWeight) {
          return captureWeight;
        } else {
          return currentWeight;
        }
      } else {
        return 0;
      }
    }
  };

  const valueNET = () => {
    if (statusTransaction === 'weighing-out' && inbound?.weighInId && inbound?.weighOutId) {
      if (inbound?.weighIn?.netto) {
        // change to positive number
        return Number(inbound.weighIn.netto) < 0
          ? Math.abs(inbound.weighIn.netto)
          : inbound.weighIn.netto;
      } else {
        return 0;
      }
    } else {
      if (inbound?.status === InboundStatus.FINISHED && inbound?.weighOut?.netto) {
        return inbound.weighOut.netto;
      } else if (isCaptureWeight && inbound?.weighIn?.weight) {
        if (inbound?.weighIn?.weight_type === 'BRUTTO') {
          return Number(inbound.weighIn.weight) - Number(captureWeight);
        } else {
          return Number(captureWeight) - Number(inbound.weighIn.weight);
        }
      } else {
        return 0;
      }
    }
  };

  data = {
    outStandingContract: 1480000,
    totalBrutto: '-10 Kg',
    totalShrinkage: '-0.02 %',
  };
  return (
    <div className="flex flex-col-5 bg-blue-100 p-2 mb-6 border rounded-md border-gray-400">
      <div className="flex gap-4 items-start">
        {/* Vehicle Number */}
        <div className="flex-shrink-0 w-48">
          <div
            className={`p-6 text-center border rounded-md border-black h-32 flex flex-col ${
              document?.vehicleNumber ? 'bg-cyan-100 block cursor-none' : 'bg-white'
            }`}
          >
            <textarea
              className="w-full flex-grow text-3xl text-center lg:text-3xl font-bold resize-none bg-inherit cursor-default"
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
          <div
            className={`grid grid-cols-3 border rounded-md text-center  border-black bg-white overflow-hidden h-32 `}
          >
            <div
              className={`flex flex-col p-1 border-black overflow-hidden h-32 border-r ${
                inbound?.weighIn?.weight || isCaptureWeight
                  ? 'bg-cyan-100 block cursor-none'
                  : 'bg-white'
              }`}
            >
              <label className="text-green-600 text-lg font-bold mb-1">W-IN</label>
              <textarea
                className="flex-grow min-h-0 w-full p-2 text-5xl text-center lg:text-5xl font-bold resize-none bg-inherit cursor-default"
                disabled={true}
                value={
                  valueWIN()
                  // inbound?.status === InboundStatus.WEIGHING_IN
                  //   ? isCaptureWeight
                  //     ? captureWeight
                  //     : currentWeight
                  //   : inbound?.status === InboundStatus.YARD ||
                  //     inbound?.status === InboundStatus.WEIGHING_OUT
                  //   ? tarraWeight
                  //   : 0
                }
              ></textarea>
            </div>

            <div
              className={`flex flex-col p-1 border-black overflow-hidden h-32 border-r ${
                inbound?.status === 'weighing-out' && isCaptureWeight
                  ? 'bg-cyan-100 block cursor-none'
                  : 'bg-white'
              }`}
            >
              <label className="text-green-600 text-lg font-bold mb-1">W-OUT</label>
              <textarea
                className="flex-grow min-h-0 w-full p-2 text-5xl text-center lg:text-5xl font-bold resize-none bg-inherit cursor-default"
                disabled={true}
                value={
                  valueWOUT()
                  // inbound?.status === InboundStatus.WEIGHING_OUT
                  //   ? isCaptureWeight
                  //     ? captureWeight
                  //     : currentWeight
                  //   : inbound?.status === InboundStatus.FINISHED
                  //   ? tarraWeight
                  //   : 0
                }
              ></textarea>
            </div>

            <div
              className={`flex flex-col p-1 border-black overflow-hidden h-32 ${
                valueNET() ? 'bg-cyan-100 block cursor-none' : 'bg-white'
              }`}
            >
              <label className="text-green-600 text-lg font-bold mb-1">W-NET</label>
              <textarea
                className="flex-grow min-h-0 w-full p-2 text-5xl text-center lg:text-5xl font-bold resize-none bg-inherit cursor-default"
                value={
                  valueNET()
                  // inbound?.status === InboundStatus.FINISHED && inbound?.weighOut?.netto
                  //   ? inbound?.weighOut?.netto
                  //   : 0
                }
                disabled={true}
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
