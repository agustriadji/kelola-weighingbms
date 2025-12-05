import { useWeighing } from '@/hooks/useWeighing';

export default function WeighingInfoTemplate() {
  const { currentBatch, batchId, vehicleHistory, tarraHistory, expectedNetto, nettoWeight } =
    useWeighing();
  const { inbound, document } = currentBatch || {};
  console.log('vehicleHistory', vehicleHistory);
  console.log('tarraHistory', tarraHistory);
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
            value={document?.driverNumber}
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
              <th className="border border-gray-400 px-1 py-1">NO. POLISI</th>
              <th className="border border-gray-400 px-1 py-1">BRUTO</th>
              <th className="border border-gray-400 px-1 py-1">TARRA</th>
              <th className="border border-gray-400 px-1 py-1">NETTO</th>
            </tr>
          </thead>
          <tbody>
            {vehicleHistory.length > 0 ? (
              vehicleHistory.map((record, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-1 py-1">{record?.plate}</td>
                  <td className="border border-gray-400 px-1 py-1">{record?.bruto}</td>
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
              <th className="border border-gray-400 px-1 py-1">NO. POLISI</th>
              <th className="border border-gray-400 px-1 py-1">Tarra Awal</th>
              <th className="border border-gray-400 px-1 py-1">Tarra Terendah</th>
              <th className="border border-gray-400 px-1 py-1">Tarra Tertinggi</th>
            </tr>
          </thead>
          <tbody>
            {tarraHistory ? (
              <tr>
                <td className="border border-gray-400 px-1 py-1">{tarraHistory?.plate}</td>
                <td className="border border-gray-400 px-1 py-1">{tarraHistory?.initial}</td>
                <td className="border border-gray-400 px-1 py-1">{tarraHistory?.min}</td>
                <td className="border border-gray-400 px-1 py-1">{tarraHistory?.max}</td>
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
