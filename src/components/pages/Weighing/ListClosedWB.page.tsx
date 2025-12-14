'use client';

import { useEffect, useState } from 'react';
import { useWeighing } from '@/hooks/useWeighing';
import { DocumentWbState } from '@/types/inbound.type';
import { Search, FileText, Download } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ListClosedWBProps {
  show: boolean;
  onClose?: () => void;
}

export default function ListClosedWB({ show, onClose }: ListClosedWBProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { listDocument, loadListDocument, isLoading } = useWeighing();

  useEffect(() => {
    loadListDocument(DocumentWbState.CLOSE_WB);
  }, []);

  const handleViewDetails = (item: any) => {
    // TODO: Implement view details modal/page
    alert(`View details for ${item.vehicle_number} - Feature coming soon`);
  };

  const handleDownloadReport = (item: any) => {
    // TODO: Implement download report
    alert(`Download report for ${item.vehicle_number} - Feature coming soon`);
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
        <h1 className="text-xl font-semibold">List Closed Weighbridge</h1>
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
        {isLoading ? (
          <LoadingSpinner size="lg" text="Loading closed weighbridge data..." />
        ) : (
          <table className="w-full text-xs">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="px-4 py-2">NO</th>
                <th className="px-4 py-2">Register ID</th>
                <th className="px-4 py-2">Vehicle Number</th>
                <th className="px-4 py-2">Material</th>
                <th className="px-4 py-2">Completed Time</th>
                <th className="px-4 py-2">Brutto (Kg)</th>
                <th className="px-4 py-2">Tarra (Kg)</th>
                <th className="px-4 py-2">Netto (Kg)</th>
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
                    <td className="px-4 py-2 text-right">{item.brutto_weight?.toLocaleString() || '-'}</td>
                    <td className="px-4 py-2 text-right">{item.tarra_weight?.toLocaleString() || '-'}</td>
                    <td className="px-4 py-2 text-right font-medium">{item.netto_weight?.toLocaleString() || '-'}</td>
                    <td className="px-4 py-2">{item.relation_name || '-'}</td>
                    <td className="px-4 py-2">{item.transporter}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1 justify-center">
                        <button
                          onClick={() => handleViewDetails(item)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          title="View Details"
                        >
                          <FileText size={12} />
                          Details
                        </button>
                        <button
                          onClick={() => handleDownloadReport(item)}
                          className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
                          title="Download Report"
                        >
                          <Download size={12} />
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                    No closed weighbridge records found
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