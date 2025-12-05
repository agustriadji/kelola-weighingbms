'use client';

import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useWeighing } from '@/hooks/useWeighing';
import { DocumentWbState } from '@/types/inbound.type';
import { X, XCircle, Play, Eye } from 'lucide-react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface ListQueueWeighingProps {
  show: boolean;
  onClose?: () => void;
}

export default function ListQueueYard({ show, onClose }: ListQueueWeighingProps) {
  const [showModal, setShowModal] = useState(false);
  const { listDocument, loadListDocument, startBatch } = useWeighing();
  const [loading, setLoading] = useState(false);

  const propertiesText = {
    headTitle: 'List Unloading',
    buttonViewText: `Process`,
    modalHeadText: 'List Unloading',
  };

  useEffect(() => {
    setShowModal(show);
    if (show) {
      loadData();
    }
  }, [show]);

  const loadData = async () => {
    setLoading(true);
    try {
      await loadListDocument(DocumentWbState.YARD_QUEUE);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    onClose?.();
  };

  const handleProcess = async (item: any) => {
    const confirmed = window.confirm(
      `Are you sure you want to start weighing process for vehicle ${item.vehicle_number}?`
    );

    if (confirmed) {
      try {
        setLoading(true);
        const success = await startBatch(item.id);

        if (success) {
          alert(`Weighing process started for ${item.vehicle_number}`);
          handleClose(); // Close modal
        } else {
          alert('Failed to start weighing process');
        }
      } catch (error) {
        console.error('Error starting process:', error);
        alert('Error starting weighing process');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Dialog.Root open={showModal} onOpenChange={handleClose}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
          <Dialog.Content className="fixed top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg max-w-7xl w-full mx-4 max-h-[90vh] overflow-y-auto z-50">
            <div className="flex justify-between items-center p-6 border-b">
              <Dialog.Title className="text-xl font-semibold">
                {propertiesText.modalHeadText}
              </Dialog.Title>
              <Dialog.Close className="text-gray-500 hover:text-gray-700">
                <XCircle size={24} color="red" />
              </Dialog.Close>
            </div>

            <div className="p-4 overflow-y-auto max-h-[95vh] relative">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2">NO</th>
                    <th className="border border-gray-300 px-4 py-2">Register ID</th>
                    <th className="border border-gray-300 px-4 py-2">Vehicle Number</th>
                    <th className="border border-gray-300 px-4 py-2">Material</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Relation</th>
                    <th className="border border-gray-300 px-4 py-2">Transporter</th>
                    <th className="border border-gray-300 px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {listDocument.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.transaction_id}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.vehicle_number}</td>
                      <td className="border border-gray-300 px-4 py-2">{item.material}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.relation_name || '-'}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{item.transporter}</td>
                      <td className="border border-gray-300 px-4 py-2">
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

              {/* Loading Overlay */}
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
                  <LoadingSpinner size="lg" text="Loading truck data..." />
                </div>
              )}
            </div>

            {/* <div className="p-6 border-t">{}</div> */}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
