import { useWeighing } from '@/hooks/useWeighing';

export default function DocumentWeighingTemplate() {
  const { currentBatch, batchId } = useWeighing();
  const { inbound, document } = currentBatch || {};
  const data = {
    outStandingContract: 1480000,
    totalBrutto: '-10 Kg',
    totalShrinkage: '-0.02 %',
  };
  return (
    <div>
      {/* Contract/SO Fields */}
      <div className="space-y-3">
        <div className="flex items-center">
          <label className="w-24 text-sm">Contract/SO*</label>
          <input
            type="text"
            value={document?.contractNumber}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">DO*</label>
          <input
            type="text"
            value={document?.doNumber}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">PO*</label>
          <input
            type="text"
            value={document?.poNumber}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">Product*</label>
          <input
            type="text"
            value={document?.material}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">Destination*</label>
          <input
            type="text"
            value={document?.destination}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">Supplier*</label>
          <input
            type="text"
            value={document?.supplier}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">Mill Original*</label>
          <input
            type="text"
            value={document?.millOrigin}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
      </div>

      {/* Weight Fields */}
      <div className="space-y-3 pt-3">
        <div className="flex items-center">
          <label className="w-24 text-sm">Bruto Supplier</label>
          <input type="text" className="flex-1 border border-gray-400 px-2 py-1" disabled={true} />
          <span className="ml-2">Kg</span>
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">Tarra Supplier</label>
          <input type="text" className="flex-1 border border-gray-400 px-2 py-1" disabled={true} />
          <span className="ml-2">Kg</span>
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">Netto Supplier</label>
          <input
            type="number"
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
          <span className="ml-2">Kg</span>
        </div>
        <div className="flex items-center">
          <label className="w-24 text-sm">Remark</label>
          <textarea
            className="w-80 border border-gray-400 px-2 py-1 h-16"
            defaultValue="REMARKS..."
          ></textarea>
        </div>
      </div>
    </div>
  );
}
