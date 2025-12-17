'use client';

import { useCallback } from 'react';
import { apiGet, apiPost } from '@/utils/api';
import { DocumentWbState, ListDocumentState, InboundStatus } from '@/types/inbound.type';

export const useApiWeighing = () => {
  const loadMasterData = useCallback(async () => {
    try {
      // const [suppliersRes, materialsRes, vehiclesRes] = await Promise.all([
      //   apiGet('/api/suppliers'),
      //   apiGet('/api/materials'),
      //   apiGet('/api/vehicles'),
      // ]);

      // const [suppliersData, materialsData, vehiclesData] = await Promise.all([
      //   suppliersRes.json(),
      //   materialsRes.json(),
      //   vehiclesRes.json(),
      // ]);

      return {
        suppliers: [],
        materials: [],
        vehicles: [],
      };
    } catch (error) {
      console.error('Error loading master data:', error);
      throw error;
    }
  }, []);

  const loadBatches = useCallback(async () => {
    try {
      const response = await apiGet('/api/batch/list');
      const data = response.json();
      return data || [];
    } catch (error) {
      console.error('Error loading batches:', error);
      throw error;
    }
  }, []);

  const loadDetailBatch = useCallback(async (id: any) => {
    try {
      const response = await apiPost(`/api/batch/detail`, { id });
      const data = response.json();
      return data || [];
    } catch (error) {
      console.error('Error loading batch:', error);
      throw error;
    }
  }, []);

  const createBatch = useCallback(async (formData: any) => {
    try {
      const response = await apiPost('/api/batch/create', formData);
      return response.ok;
    } catch (error) {
      console.error('Error creating batch:', error);
      return false;
    }
  }, []);

  const startBatch = useCallback(async (id: number, isYard?: boolean, miscCategory?: string) => {
    try {
      const response = await apiPost('/api/inbound/start', { id, isYard, miscCategory });
      return response.ok;
    } catch (error) {
      console.error('Error starting batch:', error);
      return false;
    }
  }, []);

  const endBatch = useCallback(async (id: number, expectedNetto: number, actualNetto: number) => {
    try {
      const response = await apiPost('/api/batch/end', {
        id,
        expectedNetto,
        actualNetto,
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to end batch');
    } catch (error) {
      console.error('Error ending batch:', error);
      throw error;
    }
  }, []);

  const loadVehicleHistory = useCallback(async (contractNumber?: string) => {
    try {
      const [historyRes, tarraRes] = await Promise.all([
        apiGet(`/api/vehicles/history`),
        apiGet(`/api/vehicles/tarra`),
      ]);

      const [historyData, tarraData] = await Promise.all([historyRes.json(), tarraRes.json()]);

      return {
        history: historyData.data || [],
        tarra: tarraData.data || [],
      };
    } catch (error) {
      console.error('Error loading vehicle history:', error);
      throw error;
    }
  }, []);

  const saveWeightRecord = useCallback(
    async (
      batchId: number,
      weight: number,
      stable: boolean,
      transactionType: string,
      transactionId: any,
      status: string,
      rejectReason?: string
    ) => {
      try {
        let response;
        if (status === InboundStatus.WEIGHING_IN) {
          response = await apiPost(`/api/weighin/${batchId}/brutto`, {
            brutto: weight,
            cctvUrl: null,
          });
        } else if (status === InboundStatus.WEIGHING_OUT) {
          response = await apiPost(`/api/weighout/${batchId}/tarra`, {
            tarra: weight,
            cctvUrl: null,
          });
        } else {
          throw new Error('Invalid batch status for weight saving');
        }

        if (!response.ok) {
          throw new Error('Failed to save weight');
        }

        return await response.json();
      } catch (error) {
        console.error('Error saving weight:', error);
        throw error;
      }
    },
    []
  );

  const saveWeightRecordRejected = useCallback(
    async (
      batchId: number,
      weight: number,
      stable: boolean,
      transactionType: string,
      transactionId: any,
      status: string,
      rejectReason: string
    ) => {
      try {
        await apiPost('/api/weight/reject', {
          batchId,
          weight,
          stable,
          source: 'simulation',
          transactionType,
          transactionId,
          status,
        });
      } catch (error) {
        console.error('Error saving weight:', error);
        throw error;
      }
    },
    []
  );

  const loadListDocument = useCallback(
    async (type: DocumentWbState): Promise<ListDocumentState[]> => {
      try {
        let endpoint = '/api/batch/list';

        switch (type) {
          case DocumentWbState.WEIGHING_QUEUE:
            endpoint = `/api/batch/list?status=${InboundStatus.QUEUE_IN}`;
            break;
          case DocumentWbState.YARD_QUEUE:
            endpoint = `/api/batch/list?status=${InboundStatus.YARD}`;
            break;
          case DocumentWbState.WB_REJECT:
            endpoint = `/api/batch/list?status=rejected`;
            break;
          case DocumentWbState.CLOSE_WB:
            endpoint = `/api/batch/list?status=${InboundStatus.FINISHED}`;
            break;
        }

        const response = await apiGet(endpoint);
        const data = await response.json();
        return data || [];
      } catch (error) {
        console.error(`Error loading ${type}:`, error);
        throw error;
      }
    },
    []
  );

  return {
    loadMasterData,
    loadBatches,
    loadDetailBatch,
    createBatch,
    startBatch,
    endBatch,
    loadVehicleHistory,
    saveWeightRecord,
    loadListDocument,
    saveWeightRecordRejected,
  };
};
