'use client';

import { useEffect, useState } from 'react';
import { useWeighing } from '@/hooks/useWeighing';
import { DocumentWbState } from '@/types/inbound.type';
import { Search, RotateCcw } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ListTruckRejectProps {
  show: boolean;
  onClose?: () => void;
}

export default function ListTruckReject({ show, onClose }: ListTruckRejectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { listDocument, loadListDocument, isLoading } = useWeighing();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadListDocument(DocumentWbState.WB_REJECT);
  }, []);

  const handleReprocess = async (item: any) => {
    const confirmed = window.confirm(
      `Are you sure you want to reprocess vehicle ${item.vehicle_number}?`
    );

    if (confirmed) {
      try {
        setProcessing(true);
        // TODO: Implement reprocess logic
        alert(`Reprocessing ${item.vehicle_number} - Feature coming soon`);
      } catch (error) {
        console.error('Error reprocessing:', error);
        alert('Error reprocessing vehicle');
      } finally {
        setProcessing(false);
      }
    }
  };

  const filteredData = listDocument.filter(
    (item) =>
      item.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.transporter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">List Truck Reject</h1>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-1 w-full max-w-md bg-white rounded-md border border-gray-300">
        <Search className="w-5 h-5 mx-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search vehicle, material, transporter..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 px-3 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow-sm relative">
        {isLoading || processing ? (
          <LoadingSpinner
            size="lg"
            text={processing ? 'Reprocessing...' : 'Loading rejected trucks...'}
          />
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-2">NO</th>
                <th className="px-4 py-2">Register ID</th>
                <th className="px-4 py-2">Vehicle Number</th>
                <th className="px-4 py-2">Material</th>
                <th className="px-4 py-2">Reject Time</th>
                <th className="px-4 py-2">Reject Reason</th>
                <th className="px-4 py-2">Relation</th>
                <th className="px-4 py-2">Transporter</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{item.transaction_id}</td>
                    <td className="px-4 py-2 font-medium">{item.vehicle_number}</td>
                    <td className="px-4 py-2">{item.material}</td>
                    <td className="px-4 py-2">{new Date(item.updated_at).toLocaleString()}</td>
                    <td className="px-4 py-2 text-red-600">{item.reject_reason || 'Not specified'}</td>
                    <td className="px-4 py-2">{item.relation_name || '-'}</td>
                    <td className="px-4 py-2">{item.transporter}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleReprocess(item)}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          title="Reprocess Item"
                        >
                          <RotateCcw size={14} />
                          Reprocess
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No rejected trucks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}