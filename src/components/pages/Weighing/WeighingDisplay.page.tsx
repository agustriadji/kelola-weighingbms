'use client';

import MonitorWeighingTemplate from '@/components/shared/MonitorWeighing.template';
import VehicleIdentityTemplate from '@/components/shared/VehicleIdentity.template';
import DocumentWeighingTemplate from '@/components/shared/DocumentWeighing.template';
import WeighingInfoTemplate from '@/components/shared/WeighingInfo.template';
import BatchProcessTemplate from '@/components/shared/BatchProcess.template';
import MenuListWeighingTemplate from '../../shared/MenuListWeighing.template';
import { useWeighing } from '@/hooks/useWeighing';

export default function WeighingDisplay() {
  return (
    <div className="bg-blue-100 text-center rounded-lg shadow-md p-4">
      {/* Tab Menu */}
      <MenuListWeighingTemplate />

      {/* Header Wrapper */}
      <MonitorWeighingTemplate data={null} />

      {/* Main Content */}
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
    </div>
  );
}
