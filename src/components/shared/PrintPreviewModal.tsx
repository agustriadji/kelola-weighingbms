'use client';

import { useState } from 'react';
import { useWeighing } from '@/hooks/useWeighing';
import InDocumentPrintRawNMiscTemplate from '@/components/templates/InDocumentPrintRawNMiscTemplate';
import InDocumentPrintDispatchTemplate from '@/components/templates/InDocumentPrintDispatchTemplate';
import OutDocumentPrintRawNMiscTemplate from '@/components/templates/OutDocumentPrintRawNMiscTemplate';
import OutDocumentPrintDispatchTemplate from '@/components/templates/OutDocumentPrintDispatchTemplate';
import OutDocumentPrintSusutNettoTemplate from '@/components/templates/OutDocumentPrintSusutNettoTemplate';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentType: 'raw-misc' | 'dispatch' | 'susut-netto' | null;
}

export default function PrintPreviewModal({
  isOpen,
  onClose,
  documentType,
}: PrintPreviewModalProps) {
  const { currentBatch } = useWeighing();

  if (!isOpen || !documentType || !currentBatch) return null;

  const transactionType = currentBatch?.inbound?.transactionType;
  // Determine if we're at weigh-in or weigh-out position
  const isWeighIn = currentBatch?.inbound?.weighInId && !currentBatch?.inbound?.weighOutId;
  const isWeighOut = currentBatch?.inbound?.weighInId && currentBatch?.inbound?.weighOutId;

  const handlePrint = () => {
    // Close modal after printing
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const renderTemplate = () => {
    switch (documentType) {
      case 'raw-misc':
        // Use different templates for weigh-in vs weigh-out
        return isWeighOut ? (
          <OutDocumentPrintRawNMiscTemplate onPrint={handlePrint} />
        ) : (
          <InDocumentPrintRawNMiscTemplate onPrint={handlePrint} />
        );
      case 'dispatch':
        // Use different templates for weigh-in vs weigh-out
        return isWeighOut ? (
          <OutDocumentPrintDispatchTemplate onPrint={handlePrint} />
        ) : (
          <InDocumentPrintDispatchTemplate onPrint={handlePrint} />
        );
      case 'susut-netto':
        return <OutDocumentPrintSusutNettoTemplate onPrint={handlePrint} />;
      default:
        return null;
    }
  };

  const getDocumentTitle = () => {
    switch (documentType) {
      case 'raw-misc':
        return 'Raw Material & Miscellaneous';
      case 'dispatch':
        return 'Dispatch Document';
      case 'susut-netto':
        return 'Susut Netto Document';
      default:
        return 'Document';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b print:hidden">
          <h2 className="text-lg font-semibold">Print Preview - {getDocumentTitle()}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl font-bold">
            ×
          </button>
        </div>

        {/* Template Content */}
        <div className="p-4">{renderTemplate()}</div>
      </div>
    </div>
  );
}
