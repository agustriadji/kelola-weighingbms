import { useWeighing } from '@/hooks/useWeighing';

export default function VehicleIdentityTemplate() {
  const { currentBatch, batchId } = useWeighing();
  const { inbound, document } = currentBatch || {};

  return (
    <div>
      {/* Batch Form */}
      <div className="space-y-3">
        <div className="flex items-center">
          <label className="w-32 text-sm">Register ID*</label>
          <input
            type="text"
            value={inbound?.id}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-32 text-sm">Ticket ID*</label>
          <input
            type="text"
            value={document?.id}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-32 text-sm">Vehicle Type*</label>
          <input
            type="text"
            value={document?.vehicleType}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-32 text-sm">Container*</label>
          <input
            type="text"
            value={document?.containerNumber}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-32 text-sm">Transporter*</label>
          <input
            type="text"
            value={document?.transporter}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
        <div className="flex items-center">
          <label className="w-32 text-sm">Vessel Name*</label>
          <input
            type="text"
            value={document?.vesselName}
            className="flex-1 border border-gray-400 px-2 py-1"
            disabled={true}
          />
        </div>
      </div>
    </div>
  );
}
