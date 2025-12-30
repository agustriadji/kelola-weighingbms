'use client';

import { useWeighing } from '@/hooks/useWeighing';
import PrintControl from './PrintControl';

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
    isSaved,
    loadingState,
    clearAllState,
  } = useWeighing();

  // Button states based on weighing flow
  const canCapture = currentBatch && !isCaptureWeight && !isSaved;
  const canSave = currentBatch && isCaptureWeight && !isSaved;
  const canReject = currentBatch && !isSaved;
  const canPrint = currentBatch && isSaved;

  console.log(currentBatch, isSaved, 'REJECT CONTROL STATE');
  console.log(isCaptureWeight, 'IS CAPTURE WEIGHT');
  console.log(canPrint, canReject, canSave, canCapture, 'CHECK');
  // {
  //   /* MISCELLANEOUS Category Selection */
  // }
  // {
  //   currentBatch?.inbound?.transactionType === 'MISCELLANEOUS' && (
  //     <></>
  //     // <div className="mb-3">
  //     //   <label className="block text-xs font-medium mb-2 text-purple-700">
  //     //     Weighing Category:
  //     //   </label>
  //     //   <select
  //     //     value={miscCategory || 'unloading'}
  //     //     onChange={(e) => setMiscCategory(e.target.value as 'loading' | 'unloading')}
  //     //     className="w-full border border-purple-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
  //     //   >
  //     //     <option value="">Select Category</option>
  //     //     <option value="loading">Loading (Empty → Loaded)</option>
  //     //     <option value="unloading">Unloading (Loaded → Empty)</option>
  //     //   </select>
  //     // </div>
  //   );
  // }
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

  const handleClose = () => {
    clearAllState();
    alert('Document closed and state cleared');
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
      <div className="p-4">
        {/* Button Container with proper flex layout */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Reject Button */}
          <button
            onClick={() => setRejectModalOpen(true)}
            disabled={!canReject || loadingState}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors 
              ${!canReject || loadingState ? 'hidden ' : ''}
              ${
                canReject && !loadingState
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
          >
            Reject Document
          </button>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
          >
            Close Document
          </button>

          {/* Print Control */}
          <PrintControl />

          {/* Capture Weight Button */}
          <button
            onClick={handleCaptureWeight}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors 
              ${isSaved ? 'hidden ' : ''}
              ${
                canCapture && !loadingState
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-purple-700 hover:bg-purple-800 text-white'
              }`}
          >
            {isCaptureWeight ? 'Start Weight' : 'Capture Weight'}
          </button>

          {/* Save Weight Button */}
          <button
            onClick={handleSaveWeighing}
            disabled={!canSave || loadingState}
            className={`px-4 py-2 rounded text-sm font-medium transition-colors 
              ${!canSave || loadingState ? 'hidden ' : ''}
              ${
                canSave && !loadingState
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
          >
            {loadingState ? 'Saving...' : 'Save Weight'}
          </button>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
