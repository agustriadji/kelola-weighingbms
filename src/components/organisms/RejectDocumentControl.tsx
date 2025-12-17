'use client';

import { useWeighing } from '@/hooks/useWeighing';

export default function RejectDocumentControl() {
  const {
    currentBatch,
    rejectModalOpen,
    rejectReason,
    setRejectModalOpen,
    setRejectReason,
    rejectDocument,
    captureWeightRecordState,
    startWeightSimulationAgain,
    currentWeight,
    isCaptureWeight,
    saveWeightRecordState,
    miscCategory,
    setMiscCategory,
  } = useWeighing();

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Please provide reject reason');
      return;
    }

    const success = await rejectDocument(rejectReason);
    if (success) {
      alert(`Document rejected: ${rejectReason}`);
      setRejectModalOpen(false);
      setRejectReason('');
    } else {
      alert('Failed to reject document');
    }
  };

  const handleCaptureWeight = async () => {
    if (isCaptureWeight) {
      startWeightSimulationAgain();
      alert('Weight simulation started');
    } else {
      const capture = await captureWeightRecordState();
      if (capture) {
        alert(`Weight captured successfully ${currentWeight}`);
      } else {
        alert('Failed to capture weight');
      }
    }
  };

  const handleSaveWeighing = async () => {
    setMiscCategory('unloading');
    const success = await saveWeightRecordState();
    if (success) {
      alert('Weight saved successfully');
    } else {
      alert('Failed to save weight');
    }
  };

  if (!currentBatch) return null;

  return (
    <>
      <div className="bg-purple-50 border border-purple-200 rounded-md p-4 space-y-3">
        <h3 className="font-semibold text-sm text-purple-800 mb-3">Document Control</h3>

        {/* MISCELLANEOUS Category Selection */}
        {currentBatch?.inbound?.transactionType === 'MISCELLANEOUS' && (
          <></>
          // <div className="mb-3">
          //   <label className="block text-xs font-medium mb-2 text-purple-700">
          //     Weighing Category:
          //   </label>
          //   <select
          //     value={miscCategory || 'unloading'}
          //     onChange={(e) => setMiscCategory(e.target.value as 'loading' | 'unloading')}
          //     className="w-full border border-purple-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
          //   >
          //     <option value="">Select Category</option>
          //     <option value="loading">Loading (Empty → Loaded)</option>
          //     <option value="unloading">Unloading (Loaded → Empty)</option>
          //   </select>
          // </div>
        )}

        <button
          onClick={handleCaptureWeight}
          disabled={currentBatch?.inbound?.transactionType === 'MISCELLANEOUSs' && !miscCategory}
          className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
            currentBatch?.inbound?.transactionType === 'MISCELLANEOUSs' && !miscCategory
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700 text-white'
          }`}
        >
          {isCaptureWeight ? 'Start Weight' : 'Capture Weight'}
        </button>
        <button
          onClick={handleSaveWeighing}
          disabled={!isCaptureWeight}
          className={`w-full px-4 py-2 rounded text-sm font-medium transition-colors ${
            isCaptureWeight
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
        >
          Save Weight
        </button>
        <button
          onClick={() => setRejectModalOpen(true)}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Reject Document
        </button>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Reject Document</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Reject Reason:</label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                rows={3}
                placeholder="Enter reason for rejection..."
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
