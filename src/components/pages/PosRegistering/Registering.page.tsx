'use client';

import { useState, useEffect } from 'react';
import ListIncomingPage from './ListIncoming.page';
import ListOutgoingPage from './ListOutgoing.page';
import ListMiscPage from './ListMisc.page';
import NavbarTemplate from '@/components/templates/NavbarTemplate';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Footer from '@/components/templates/Footer';
import MenuHeaderRegisterDocPage from './MenuHeaderRegisterDoc.page';
import { useSysStore } from '@/store/sys.store';
import { RegisterDocType, RegisterDocTypeAPI } from '@/types/inbound.type';
import { Permissions } from '@/types/rbac';

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
            <MenuHeaderRegisterDocPage />
            {/* LISTS */}
            {activeMenuState === RegisterDocType.RAW_MATERIAL && (
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
            )}
            {activeMenuState === RegisterDocType.DISPATCH && (
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
            )}
            {activeMenuState === RegisterDocType.MISCELLANEOUS && (
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
            )}
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
