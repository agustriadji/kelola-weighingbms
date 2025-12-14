/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Search } from 'lucide-react';
import FormMiscPage from '@/components/pages/PosRegistering/FormMisc.page';
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { RegisterDocTypeName } from '@/types/inbound.type';
import { statusColor } from '@/utils/statusColor';
import Pagination from '@/components/shared/Pagination';

export default function ListMiscPage({
  data,
  refresh,
  isLoading,
  page,
  limit,
  totalPages,
  totalData,
  onPageChange,
  onLimitChange,
}: {
  data: any[];
  refresh: () => void;
  isLoading?: boolean;
  page: number;
  limit: number;
  totalPages: number;
  totalData: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.contract_number?.toLowerCase().includes(query) ||
      item.material?.toLowerCase().includes(query) ||
      item.vehicle_number?.toLowerCase().includes(query) ||
      item.transporter?.toLowerCase().includes(query)
    );
  });
  const propertiesText = {
    headTitle: `List ${RegisterDocTypeName.MISCELLANEOUS}`,
    buttonCreateText: `+ Create`,
    buttonViewText: `View`,
    modalHeadText: `Create ${RegisterDocTypeName.MISCELLANEOUS}`,
  };

  async function showDetail(id) {
    setDetailId(id);
    setShowModal(true);
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{propertiesText.headTitle}</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          {propertiesText.buttonCreateText}
        </button>
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
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Contract/SO</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Vehicle Number</th>
              <th className="px-4 py-2">Vehivle Type</th>
              <th className="px-4 py-2">Transporter</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Time</th>
              {/* <th className="px-4 py-2 text-right">Actions</th> */}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr className="border-t">
                <td colSpan={12} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-gray-600">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr className="border-t">
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{item.id}</td>
                  <td className="px-4 py-2">{item.contract_number}</td>
                  <td className="px-4 py-2">{item.material}</td>
                  <td className="px-4 py-2">{item.vehicle_number}</td>
                  <td className="px-4 py-2">{item.vehicle_type}</td>
                  <td className="px-4 py-2">{item.transporter}</td>
                  <td className={`px-4 py-2`}>
                    <span
                      className={`rounded-md p-1 text-xs font-bold ${statusColor(item.status)}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        limit={limit}
        totalPages={totalPages}
        totalData={totalData}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />

      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-7xl w-full mx-4 max-h-[90vh] h-auto z-50">
            <div className="flex justify-between items-center px-6 pt-4 pb-2 border-b">
              <Dialog.Title className="text-xl font-semibold">
                {propertiesText.modalHeadText}
                <h2 className="font-semibold text-xs pt-2 text-slate-500">Document Verification</h2>
              </Dialog.Title>
              <Dialog.Close className="text-gray-500 hover:text-gray-700">✕</Dialog.Close>
            </div>

            <div className="p-6">
              <FormMiscPage
                onSuccess={() => {
                  refresh();
                  setShowModal(false);
                  setDetailId(null);
                }}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
