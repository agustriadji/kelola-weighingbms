'use client';

import { Search, Eye } from 'lucide-react';
import FormOutgoingPage from '@/components/pages/PosRegistering/FormOutgoing.page';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';

export default function ListOutgoingPage({ data, refresh }: { data: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const { control } = useForm();
  const propertiesText = {
    headTitle: 'List Outgoing',
    buttonCreateText: `+ Create`,
    buttonViewText: `View`,
    modalHeadText: 'Create Outgoing',
  };
  // TODO: Replace with real DB/API call
  //   const data = [
  //     {
  //       id: 'TRX-20250201-001',
  //       contractNumber: 'TRX-20250201-002',
  //       certificate: 'DO',
  //       materialName: 'CPO',
  //       vehicleNumber: 'BK 1234 AB',
  //       vehicleType: 'Tanki',
  //       transporter: 'PT Angkut Jaya',
  //       vesselName: 'DO-99281',
  //       sealNumber: 'dsfdsf',
  //       status: 'pending',
  //       timestamp: '2025-02-01 10:20',
  //     },
  //     {
  //       id: 'TRX-20250201-003',
  //       contractNumber: 'TRX-20250201-004',
  //       certificate: 'DO',
  //       materialName: 'CPO',
  //       vehicleNumber: 'BK 1234 AB',
  //       vehicleType: 'Tanki',
  //       transporter: 'PT Angkut Jaya',
  //       vesselName: 'DO-99281',
  //       sealNumber: 'dsfdsf',
  //       status: 'pending',
  //       timestamp: '2025-02-01 10:20',
  //     },
  //   ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{propertiesText?.headTitle}</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
        >
          {propertiesText?.buttonCreateText}
        </button>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 w-full max-w-md">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search plate / supplier / DO..."
          className="w-full h-10 px-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg bg-white shadow-sm">
        <table className="w-full text-xs">
          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Contract/SO</th>
              <th className="px-4 py-2">Certificate</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Vehicle Number</th>
              <th className="px-4 py-2">Vehicle Type</th>
              <th className="px-4 py-2">Transporter</th>
              <th className="px-4 py-2">Vessel Name</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Timestamp</th>
              {/* <th className="px-4 py-2 text-right">Actions</th> */}
            </tr>
          </thead>

          <tbody>
            {data.map((item: any) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2 font-medium">{item.id}</td>
                <td className="px-4 py-2">{item.contract_number}</td>
                <td className="px-4 py-2">{item.certificate}</td>
                <td className="px-4 py-2">{item.material}</td>
                <td className="px-4 py-2">{item.vehicle_number}</td>
                <td className="px-4 py-2">{item.vehicle_type}</td>
                <td className="px-4 py-2">{item.transporter}</td>
                <td className="px-4 py-2">{item.vessel_name}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      'px-2 py-1 rounded text-xs font-medium ' +
                      (item.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : item.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700')
                    }
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-2">{item.created_at}</td>

                {/* <td className="px-4 py-2 text-right">
                  <a
                    href={`/inbound/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" /> {propertiesText.buttonViewText}
                  </a>
                </td> */}
              </tr>
            ))}
            {data.length === 0 && (
              <tr className="border-t">
                <td colSpan={12} className="px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog.Root open={showModal} onOpenChange={setShowModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] z-50">
            <div className="flex justify-between items-center p-6 border-b">
              <Dialog.Title className="text-xl font-semibold">
                {propertiesText.modalHeadText}
              </Dialog.Title>
              <Dialog.Close className="text-gray-500 hover:text-gray-700">✕</Dialog.Close>
            </div>

            <div className="p-4 overflow-y-auto max-h-[75vh]">
              <FormOutgoingPage
                onSuccess={() => {
                  refresh();
                  setShowModal(false);
                }}
              />
            </div>

            {/* <div className="p-6 border-t">
      
      
                    <div className="grid grid-cols-2 gap-4 pt-3 max-w-xs ml-auto">
                      <ButtonDocumentAction control={control} />
                    </div>
                  </div> */}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
