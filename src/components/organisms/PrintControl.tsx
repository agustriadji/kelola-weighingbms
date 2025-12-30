'use client';

import { useState } from 'react';
import { useWeighing } from '@/hooks/useWeighing';
import PrintPreviewModal from '@/components/shared/PrintPreviewModal';

export default function PrintControl() {
  const { currentBatch, isSaved } = useWeighing();
  const [showModal, setShowModal] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<
    'raw-misc' | 'dispatch' | 'susut-netto' | null
  >(null);
  const [showDocSelection, setShowDocSelection] = useState(false);

  // Only show print control if batch is saved
  const canPrint = currentBatch && isSaved;

  // Determine position and available templates
  const transactionType = currentBatch?.inbound?.transactionType;

  const isWeighIn = currentBatch?.inbound?.weighInId && !currentBatch?.inbound?.weighOutId;
  const isWeighOut = currentBatch?.inbound?.weighInId && currentBatch?.inbound?.weighOutId;

  const handlePrintClick = () => {
    if (!canPrint) return;

    console.log('Print clicked - Debug info:', {
      isWeighIn,
      isWeighOut,
      transactionType,
      weighInWeight: currentBatch?.inbound?.weighIn?.weight,
      weighOutWeight: currentBatch?.inbound?.weighOut?.weight,
    });

    // Auto-select template for weigh-in position
    if (isWeighIn) {
      const autoDocType = transactionType === 'DISPATCH' ? 'dispatch' : 'raw-misc';
      setSelectedDocType(autoDocType);
      setShowModal(true);
    } else if (isWeighOut) {
      // Show selection for weigh-out position
      console.log('Showing doc selection for weigh-out');
      setShowDocSelection(true);
    } else {
      console.log('No valid weigh position detected');
    }
  };

  const handleDocumentSelect = (docType: 'raw-misc' | 'dispatch' | 'susut-netto') => {
    setSelectedDocType(docType);
    setShowDocSelection(false);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDocType(null);
  };

  if (!canPrint) {
    return (
      //   <button
      //     disabled
      //     className="px-4 py-2 rounded font-medium bg-gray-400 text-gray-600 cursor-not-allowed"
      //   >
      //     Print Document
      //   </button>
      <></>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={handlePrintClick}
          className="px-4 py-2 rounded font-medium transition-colors bg-purple-600 hover:bg-purple-700 text-white"
        >
          Print Document
        </button>

        {/* Document Selection Dropdown */}
        {showDocSelection && isWeighOut && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-48">
            {/* Document Templates */}
            <button
              onClick={() =>
                handleDocumentSelect(transactionType === 'DISPATCH' ? 'dispatch' : 'raw-misc')
              }
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
            >
              {transactionType === 'DISPATCH'
                ? 'Dispatch Document'
                : 'Raw Material & Miscellaneous'}
            </button>

            {/* Susut Netto Template - Only for weigh-out */}
            <button
              onClick={() => handleDocumentSelect('susut-netto')}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-t border-gray-200"
            >
              Susut Netto Document
            </button>

            <button
              onClick={() => setShowDocSelection(false)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm border-t border-gray-200 text-gray-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Print Preview Modal */}
      <PrintPreviewModal
        isOpen={showModal}
        onClose={handleCloseModal}
        documentType={selectedDocType}
      />

      {/* Click outside to close dropdown */}
      {showDocSelection && (
        <div className="fixed inset-0 z-5" onClick={() => setShowDocSelection(false)} />
      )}
    </>
  );
}
