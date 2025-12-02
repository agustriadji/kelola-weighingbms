'use client';

import { Search, Eye, Weight, Scale } from 'lucide-react';
import { ButtonDocumentAction } from '../../molecules/ButtonDocument.molecules';
//import { DocumentIncomingOrganism } from '@/components/organisms/DocumentIncoming.organism';
import FormIncomingPage from '@/components/pages/pos1/FromIncoming.page';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Dialog from '@radix-ui/react-dialog';
import { statusColor } from '@/utils/statusColor';

export default function ListIncomingPage({ data, refresh }: { data: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const { control } = useForm();
  const propertiesText = {
    headTitle: 'List Incoming',
    buttonCreateText: `+ Create`,
    buttonViewText: `View`,
    modalHeadText: 'Create Incoming',
    queueWeighIn: 'Queue',
  };
  // TODO: Replace with real DB/API call
  //   const data = [
  //     {
  //       id: 'TRX-20250201-001',
  //       contractNumber: 'SO-20250201-001',
  //       transporter: 'PT Angkut Jaya',
  //       vehicleNumber: 'BK 1234 AB',
  //       vehicleType: 'PT Sawit Makmur',
  //       driverName: '',
  //       driverId: '',
  //       containerNumber: '',
  //       sealNumber: '',
  //       supplier: 'DO',
  //       doNumber: 'DO-99281',
  //       poNumber: 'DO-99281',
  //       material: '',
  //       millOrigin: 'Mill1234',
  //       certificate: '',
  //       spbNumber: '',
  //       spbDate: '',
  //       bcNumber: '',
  //       bcType: '',
  //       bcStatus: '',
  //       ffa: '',
  //       moist: '',
  //       impurties: '',
  //       status: 'pending',
  //       timestamp: '2025-02-01 10:20',
  //     },
  //     {
  //       id: 'TRX-20250201-001',
  //       contractNumber: 'SO-20250201-001',
  //       transporter: 'PT Angkut Jaya',
  //       vehicleNumber: 'BK 1234 AB',
  //       vehicleType: 'PT Sawit Makmur',
  //       driverName: '',
  //       driverId: '',
  //       containerNumber: '',
  //       sealNumber: '',
  //       supplier: 'DO',
  //       doNumber: 'DO-99281',
  //       poNumber: 'DO-99281',
  //       material: '',
  //       millOrigin: 'Mill1234',
  //       certificate: '',
  //       spbNumber: '',
  //       spbDate: '',
  //       bcNumber: '',
  //       bcType: '',
  //       bcStatus: '',
  //       ffa: '',
  //       moist: '',
  //       impurties: '',
  //       status: 'pending',
  //       timestamp: '2025-02-01 10:20',
  //     },
  //   ];
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
              {/**
               *       id: true,
      contractNumber: true,
      supplier: true,
      material: true,
      certificate: true,
      vehicleNumber: true,
      vehicleType: true,
      transporter: true,
      driverName: true,
      spbDate: true,
      spbNumber: true,
      createdAt: true,
               */}
              <th className="px-4 py-2">No.Contract</th>
              <th className="px-4 py-2">Supplier</th>
              <th className="px-4 py-2">Material</th>
              <th className="px-4 py-2">Certificate</th>
              <th className="px-4 py-2">No.Vehicle</th>
              <th className="px-4 py-2">vehicle Type</th>
              <th className="px-4 py-2">Transporter</th>
              <th className="px-4 py-2">Driver Name</th>
              <th className="px-4 py-2">No.SPB</th>
              <th className="px-4 py-2">SPB Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Timestamp</th>
              {/* <th className="px-4 py-2 text-right">Actions</th> */}
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-2">{item.contract_number}</td>
                <td className="px-4 py-2">{item.supplier}</td>
                <td className="px-4 py-2">{item.material}</td>
                <td className="px-4 py-2">{item.certificate}</td>
                <td className="px-4 py-2">{item.vehicle_number}</td>
                <td className="px-4 py-2">{item.vehicle_type}</td>
                <td className="px-4 py-2">{item.transporter}</td>
                <td className="px-4 py-2">{item.driver_name}</td>
                <td className="px-4 py-2">{item.spb_number}</td>
                <td className="px-4 py-2">{item.spb_date}</td>

                {/* <td className="px-4 py-2">
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
                </td> */}
                <td className={`px-4 py-2 rounded text-xs font-medium ${statusColor(item.status)}`}>
                  {item.status}
                </td>
                <td className="px-4 py-2">{new Date(item.created_at).toLocaleString()}</td>

                {/* <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => {
                      setDetailId(item.id); // id incoming yg dipilih
                      setShowModal(true); // buka modal
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDetailId(item.id); // id incoming yg dipilih
                      setShowModal(true); // buka modal
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 border rounded-md hover:bg-gray-100"
                  >
                    <Scale className="w-4 h-4" />
                  </button>
                </td> */}
              </tr>
            ))}
            {
              /**
               * empty data
               */
              data.length === 0 && (
                <tr className="border-t">
                  <td colSpan={12} className="px-4 py-2 text-center">
                    No data available
                  </td>
                </tr>
              )
            }
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
              <FormIncomingPage
                onSuccess={() => {
                  refresh();
                  setShowModal(false);
                  setDetailId(null);
                }}
                detail={detailId}
                onClose={() => {
                  setShowModal(false);
                  setDetailId(null);
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
