'use client';

import { useEffect, useState } from 'react';
import { useWeighing } from '@/hooks/useWeighing';
import { DocumentWbState } from '@/types/inbound.type';
import { Play, Search } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ListQueueWeighingProps {
  show: boolean;
  onClose?: () => void;
}

export default function ListQueueWeighing({ show, onClose }: ListQueueWeighingProps) {
  const { listDocument, loadListDocument, startBatch, isLoading } = useWeighing();
  const [searchQuery, setSearchQuery] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadListDocument(DocumentWbState.WEIGHING_QUEUE);
  }, []);

  const handleProcess = async (item: any) => {
    console.log('Processing item:', item);
    const confirmed = window.confirm(
      `Are you sure you want to start weighing process for vehicle ${item.vehicle_number}?`
    );

    if (confirmed) {
      try {
        setProcessing(true);
        const success = await startBatch(item.id);

        if (success) {
          alert(`Weighing process started for ${item.vehicle_number}`);
          onClose?.();
        } else {
          alert('Failed to start weighing process');
        }
      } catch (error) {
        console.error('Error starting process:', error);
        alert('Error starting weighing process');
      } finally {
        setProcessing(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">List Truck Parking</h1>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-1 w-full max-w-md bg-white rounded-md border border-gray-300">
        <Search className="w-5 h-5 mx-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 px-3  focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-sm">
        {isLoading || processing ? (
          <LoadingSpinner
            size="lg"
            text={processing ? 'Starting weighing...' : 'Loading truck data...'}
          />
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-2">NO</th>
                <th className="px-4 py-2">Register ID</th>
                <th className="px-4 py-2">Vehicle Number</th>
                <th className="px-4 py-2">Material</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Relation</th>
                <th className="px-4 py-2">Transporter</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {listDocument.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.transaction_id}</td>
                  <td className="px-4 py-2">{item.vehicle_number}</td>
                  <td className="px-4 py-2">{item.material}</td>
                  <td className="px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">{item.relation_name || '-'}</td>
                  <td className="px-4 py-2">{item.transporter}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleProcess(item)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        title="Process Item"
                      >
                        <Play size={14} />
                        Start Weight
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
