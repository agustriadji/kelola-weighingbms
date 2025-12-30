'use client';

import { lazy, Suspense } from 'react';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import SkeletonLoader from '@/components/shared/SkeletonLoader';
import { DocumentWbState } from '@/types/inbound.type';
import { useWeighing } from '@/hooks/useWeighing';
import RejectDocumentControl from '@/components/organisms/RejectDocumentControl';
import PrintControl from '@/components/organisms/PrintControl';
import DocumentWeighingTemplate from '@/components/shared/DocumentWeighing.template';
import WeighingInfoTemplate from '@/components/shared/WeighingInfo.template';
import MenuListWeighingTemplate from '@/components/shared/MenuListWeighing.template';
import VehicleIdentityTemplate from '@/components/shared/VehicleIdentity.template';

// Lazy load heavy components
const MonitorWeighingTemplate = lazy(() => import('@/components/shared/MonitorWeighing.template'));
const BatchProcessTemplate = lazy(() => import('@/components/shared/BatchProcess.template'));
const ListQueueWeighing = lazy(() => import('@/components/pages/Weighing/ListQueueWeighing.page'));
const ListQueueYard = lazy(() => import('@/components/pages/Weighing/ListQueueYard.page'));
const ListTruckReject = lazy(() => import('@/components/pages/Weighing/ListTruckReject.page'));
const ListClosedWB = lazy(() => import('@/components/pages/Weighing/ListClosedWB.page'));

export default function WeighingDisplay() {
  const { activeListWeighingState, setActiveListWeighingState, batchId } = useWeighing();

  return (
    <div className="bg-cyan-200 rounded-lg shadow-md">
      {/* Main Content */}
      <div className="min-h-screen">
        <div className="p-4 w-full max-w-screen-2xl mx-auto">
          {/* Tab Menu */}
          <Suspense
            fallback={
              <div className="h-12 flex items-center justify-center">
                <LoadingSpinner size="sm" />
              </div>
            }
          >
            <MenuListWeighingTemplate />
          </Suspense>

          {activeListWeighingState === DocumentWbState.WEIGHING_QUEUE ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12">
                <Suspense
                  fallback={
                    <div className="h-96 flex items-center justify-center">
                      <LoadingSpinner size="lg" text="Loading queue..." />
                    </div>
                  }
                >
                  <ListQueueWeighing
                    show={true}
                    onClose={() => setActiveListWeighingState('weighing')}
                  />
                </Suspense>
              </div>
            </div>
          ) : activeListWeighingState === DocumentWbState.YARD_QUEUE ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12">
                <Suspense
                  fallback={
                    <div className="h-96 flex items-center justify-center">
                      <LoadingSpinner size="lg" text="Loading yard queue..." />
                    </div>
                  }
                >
                  <ListQueueYard
                    show={true}
                    onClose={() => setActiveListWeighingState('weighing')}
                  />
                </Suspense>
              </div>
            </div>
          ) : activeListWeighingState === DocumentWbState.WB_REJECT ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12">
                <Suspense
                  fallback={
                    <div className="h-96 flex items-center justify-center">
                      <LoadingSpinner size="lg" text="Loading rejected trucks..." />
                    </div>
                  }
                >
                  <ListTruckReject
                    show={true}
                    onClose={() => setActiveListWeighingState('weighing')}
                  />
                </Suspense>
              </div>
            </div>
          ) : activeListWeighingState === DocumentWbState.CLOSE_WB ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-12">
                <Suspense
                  fallback={
                    <div className="h-96 flex items-center justify-center">
                      <LoadingSpinner size="lg" text="Loading closed weighbridge..." />
                    </div>
                  }
                >
                  <ListClosedWB
                    show={true}
                    onClose={() => setActiveListWeighingState('weighing')}
                  />
                </Suspense>
              </div>
            </div>
          ) : (
            <>
              <Suspense
                fallback={
                  <div className="h-32 flex items-center justify-center">
                    <LoadingSpinner size="md" text="Loading monitor..." />
                  </div>
                }
              >
                <MonitorWeighingTemplate data={batchId} />
              </Suspense>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Section */}
                <div className="lg:col-span-4 space-y-4">
                  <Suspense
                    fallback={
                      <SkeletonLoader type="form" rows={4} className="bg-white rounded-lg p-4" />
                    }
                  >
                    <VehicleIdentityTemplate />
                  </Suspense>
                  <Suspense fallback={<SkeletonLoader type="card" rows={2} className="h-32" />}>
                    <BatchProcessTemplate />
                  </Suspense>
                </div>

                {/* Center Section */}
                <div className="lg:col-span-4 space-y-4">
                  <Suspense fallback={<SkeletonLoader type="card" rows={6} className="h-64" />}>
                    <DocumentWeighingTemplate />
                  </Suspense>
                </div>

                {/* Right Section */}
                <div className="lg:col-span-4 space-y-4">
                  <Suspense fallback={<SkeletonLoader type="form" rows={3} className="h-48" />}>
                    <WeighingInfoTemplate />
                  </Suspense>
                </div>
              </div>

              {/* Reject Document Control */}
              <div className="mt-10 pt-10 float-right">
                <RejectDocumentControl />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
