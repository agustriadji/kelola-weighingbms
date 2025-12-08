'use client';

import MonitorWeighingTemplate from '@/components/shared/MonitorWeighing.template';
import VehicleIdentityTemplate from '@/components/shared/VehicleIdentity.template';
import DocumentWeighingTemplate from '@/components/shared/DocumentWeighing.template';
import WeighingInfoTemplate from '@/components/shared/WeighingInfo.template';
import BatchProcessTemplate from '@/components/shared/BatchProcess.template';
import MenuListWeighingTemplate from '@/components/shared/MenuListWeighing.template';
import ListQueueWeighing from '@/components/pages/Weighing/ListQueueWeighing.page';
import ListQueueYard from '@/components/pages/Weighing/ListQueueYard.page';
import { DocumentWbState } from '@/types/inbound.type';
import { useWeighing } from '@/hooks/useWeighing';

export default function WeighingDisplay() {
  const { activeListWeighingState, setActiveListWeighingState } = useWeighing();
  return (
    <div className="text-center p-4">
      {/* Tab Menu */}
      <MenuListWeighingTemplate />

      {activeListWeighingState === DocumentWbState.WEIGHING_QUEUE ? (
        <ListQueueWeighing show={true} onClose={() => setActiveListWeighingState('weighing')} />
      ) : activeListWeighingState === DocumentWbState.YARD_QUEUE ? (
        <ListQueueYard show={true} onClose={() => setActiveListWeighingState('weighing')} />
      ) : (
        <>
          <MonitorWeighingTemplate data={null} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Section */}
            <div className="lg:col-span-4 space-y-4">
              {/* Batch Form */}
              <VehicleIdentityTemplate />

              {/* Batch Status Display */}
              <BatchProcessTemplate />
            </div>

            {/* Center Section */}
            <div className="lg:col-span-4 space-y-4">
              <DocumentWeighingTemplate />
            </div>

            {/* Right Section */}
            <div className="lg:col-span-4 space-y-4">
              <WeighingInfoTemplate />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
