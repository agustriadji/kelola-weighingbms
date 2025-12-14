'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import NavbarTemplate from '@/components/templates/NavbarTemplate';
import { useSysStore } from '@/store/sys.store';
import { RegisterDocType, RegisterDocTypeAPI } from '@/types/inbound.type';
import { Permissions } from '@/types/rbac';

// Lazy load components
const ListIncomingPage = lazy(() => import('./ListIncoming.page'));
const ListOutgoingPage = lazy(() => import('./ListOutgoing.page'));
const ListMiscPage = lazy(() => import('./ListMisc.page'));
const Footer = lazy(() => import('@/components/templates/Footer'));
const MenuHeaderRegisterDocPage = lazy(() => import('./MenuHeaderRegisterDoc.page'));

export default function Pos1Page() {
  const { activeMenuState, setActiveMenuState, setLoadingState } = useSysStore();
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    setAllData([]);
    setLoadingState(true);
    if (!RegisterDocTypeAPI[activeMenuState]) {
      setActiveMenuState(RegisterDocType.RAW_MATERIAL);
    }
    setLoadingState(false);
  }, []);

  useEffect(() => {
    if (RegisterDocTypeAPI[activeMenuState]) {
      setPage(1);
      loadData();
    }
  }, [activeMenuState]);

  const loadData = async () => {
    if (!activeMenuState) return;
    setIsLoading(true);
    try {
      const subpath = RegisterDocTypeAPI[activeMenuState];
      const res = await fetch(`/api/pos1/${subpath}`);
      const data = await res.json();

      setAllData(data.data || []);
    } finally {
      setIsLoading(false);
    }
  };

  const paginatedData = allData.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(allData.length / limit);

  return (
    <ProtectedRoute requiredPermissions={[Permissions.VIEW_DASHBOARD, Permissions.CREATE_WEIGHING]}>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <NavbarTemplate />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="bg-cyan-200 rounded-lg shadow-md p-2">
            <Suspense
              fallback={
                <div className="h-12 flex items-center justify-center">
                  <LoadingSpinner size="sm" />
                </div>
              }
            >
              <MenuHeaderRegisterDocPage />
            </Suspense>
            {/* LISTS */}
            {activeMenuState === RegisterDocType.RAW_MATERIAL && (
              <Suspense
                fallback={
                  <div className="h-96 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading incoming data..." />
                  </div>
                }
              >
                <ListIncomingPage
                  data={paginatedData}
                  refresh={loadData}
                  isLoading={isLoading}
                  page={page}
                  limit={limit}
                  totalPages={totalPages}
                  totalData={allData.length}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </Suspense>
            )}
            {activeMenuState === RegisterDocType.DISPATCH && (
              <Suspense
                fallback={
                  <div className="h-96 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading outgoing data..." />
                  </div>
                }
              >
                <ListOutgoingPage
                  data={paginatedData}
                  refresh={loadData}
                  isLoading={isLoading}
                  page={page}
                  limit={limit}
                  totalPages={totalPages}
                  totalData={allData.length}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </Suspense>
            )}
            {activeMenuState === RegisterDocType.MISCELLANEOUS && (
              <Suspense
                fallback={
                  <div className="h-96 flex items-center justify-center">
                    <LoadingSpinner size="lg" text="Loading misc data..." />
                  </div>
                }
              >
                <ListMiscPage
                  data={paginatedData}
                  refresh={loadData}
                  isLoading={isLoading}
                  page={page}
                  limit={limit}
                  totalPages={totalPages}
                  totalData={allData.length}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </Suspense>
            )}
          </div>
        </div>
        <Suspense
          fallback={
            <div className="h-16 flex items-center justify-center">
              <LoadingSpinner size="sm" />
            </div>
          }
        >
          <Footer />
        </Suspense>
      </div>
    </ProtectedRoute>
  );
}
