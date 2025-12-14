import { useWeighing } from '@/hooks/useWeighing';

export default function WeighingInfoTemplate() {
  const { currentBatch, batchId, vehicleHistory, tarraHistory, expectedNetto, nettoWeight } =
    useWeighing();
  const { inbound, document } = currentBatch || {};

  const data = {
    outStandingContract: 1480000,
    totalBrutto: '-10 Kg',
    totalShrinkage: '-0.02 %',
  };
  return (
    <div>
      {/* Seal & SIM */}
      <div className="space-y-2 pb-4">
        <div className="flex">
          <label className="w-16 text-xs">NO. SEAL</label>
          <input
            type="text"
            value={document?.sealNumber}
            className="flex-1 border border-gray-400 px-1 py-1 text-xs"
            disabled={true}
          />
        </div>
        <div className="flex">
          <label className="w-16 text-xs">NO. SIM</label>
          <input
            type="text"
            value={document?.driverId}
            className="flex-1 border border-gray-400 px-1 py-1 text-xs"
            disabled={true}
          />
        </div>
      </div>

      {/* Vehicle History */}
      <div className="pb-4">
        <div className="text-sm font-semibold mb-2">Vehicle History</div>
        <table className="w-full text-xs border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-1 py-1">Vehicle No.</th>
              <th className="border border-gray-400 px-1 py-1">Brutto</th>
              <th className="border border-gray-400 px-1 py-1">Tarra</th>
              <th className="border border-gray-400 px-1 py-1">Netto</th>
            </tr>
          </thead>
          <tbody>
            {vehicleHistory.length > 0 ? (
              vehicleHistory.map((record, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-1 py-1">{record?.driver_number}</td>
                  <td className="border border-gray-400 px-1 py-1">{record?.brutto}</td>
                  <td className="border border-gray-400 px-1 py-1">{record?.tarra}</td>
                  <td className="border border-gray-400 px-1 py-1">{record?.netto}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="border border-gray-400 px-1 py-1 text-center">
                  No history data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tarra History */}
      <div className="pb-4">
        <div className="text-sm font-semibold mb-2">Tarra History</div>
        <table className="w-full text-xs border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-1 py-1">Vehicle No.</th>
              <th className="border border-gray-400 px-1 py-1">Initial Tarra</th>
              <th className="border border-gray-400 px-1 py-1">Lowest Tarra</th>
              <th className="border border-gray-400 px-1 py-1">Highest Tarra</th>
            </tr>
          </thead>
          <tbody>
            {tarraHistory ? (
              <tr>
                <td className="border border-gray-400 px-1 py-1">{tarraHistory?.driver_number}</td>
                <td className="border border-gray-400 px-1 py-1">{tarraHistory?.tarra_awal}</td>
                <td className="border border-gray-400 px-1 py-1">{tarraHistory?.tarra_terendah}</td>
                <td className="border border-gray-400 px-1 py-1">
                  {tarraHistory?.tarra_tertinggi}
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={4} className="border border-gray-400 px-1 py-1 text-center">
                  No tarra data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Fields */}
      <div className="space-y-2">
        <div className="flex">
          <label className="w-20 text-xs">Netto Final*</label>
          <input
            type="text"
            value={nettoWeight || '0'}
            className="flex-1 border border-gray-400 px-1 py-1 text-xs"
            readOnly
          />
          <span className="text-xs ml-1">Kg</span>
        </div>
        <div className="flex">
          <label className="w-20 text-xs">Susut/Gain*</label>
          <input
            type="text"
            value={expectedNetto && nettoWeight ? (expectedNetto - nettoWeight).toFixed(2) : '0'}
            className="flex-1 border border-gray-400 px-1 py-1 text-xs"
            readOnly
          />
          <span className="text-xs ml-1">Kg</span>
        </div>
        <div className="flex">
          <label className="w-20 text-xs">Shrinkage %*</label>
          <input
            type="text"
            value={
              expectedNetto && nettoWeight
                ? (((expectedNetto - nettoWeight) / expectedNetto) * 100).toFixed(3)
                : '0'
            }
            className={`flex-1 border px-1 py-1 text-xs ${
              expectedNetto &&
              nettoWeight &&
              ((expectedNetto - nettoWeight) / expectedNetto) * 100 > 0.2
                ? 'border-red-400 bg-red-50'
                : 'border-gray-400'
            }`}
            readOnly
          />
          <span className="text-xs ml-1">%</span>
        </div>
      </div>
    </div>
  );
}
