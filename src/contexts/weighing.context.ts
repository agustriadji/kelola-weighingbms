'use client';

import { apiGet, apiPost } from '@/utils/api';
import { DocumentWbState, ListDocumentState, InboundStatus } from '@/types/inbound.type';

export interface WeighingContextType {
  // Master Data Operations
  loadMasterData: () => Promise<{
    suppliers: any[];
    materials: any[];
    vehicles: any[];
  }>;

  // Batch Operations
  loadBatches: () => Promise<any[]>;
  loadDetailBatch: (id: any) => Promise<any>;
  createBatch: (formData: any) => Promise<boolean>;
  startBatch: (id: number, isYard?: boolean) => Promise<boolean>;
  endBatch: (id: number, expectedNetto: number, actualNetto: number) => Promise<any>;

  // Vehicle Operations
  loadVehicleHistory: (vehicleId: number) => Promise<{
    history: any[];
    tarra: any;
  }>;

  // Weight Operations
  saveWeightRecord: (
    batchId: number,
    weight: number,
    stable: boolean,
    tracsactionType: string,
    transactionsId: any,
    status: string
  ) => Promise<void>;

  loadListDocument: (type: DocumentWbState) => Promise<ListDocumentState[]>;
}

export const weighingContext: WeighingContextType = {
  loadMasterData: async () => {
    try {
      const [suppliersRes, materialsRes, vehiclesRes] = await Promise.all([
        apiGet('/api/suppliers'),
        apiGet('/api/materials'),
        apiGet('/api/vehicles'),
      ]);

      const [suppliersData, materialsData, vehiclesData] = await Promise.all([
        suppliersRes.json(),
        materialsRes.json(),
        vehiclesRes.json(),
      ]);

      return {
        suppliers: suppliersData.suppliers || [],
        materials: materialsData.materials || [],
        vehicles: vehiclesData.vehicles || [],
      };
    } catch (error) {
      console.error('Error loading master data:', error);
      throw error;
    }
  },

  loadBatches: async () => {
    try {
      const response = await apiGet('/api/batch/list');
      const data = response.json();
      return data || [];
    } catch (error) {
      console.error('Error loading batches:', error);
      throw error;
    }
  },

  loadDetailBatch: async (id) => {
    try {
      const response = await apiPost(`/api/batch/detail`, { id });
      const data = response.json();
      return data || [];
    } catch (error) {
      console.error('Error loading batch:', error);
      throw error;
    }
  },

  createBatch: async (formData: any) => {
    try {
      const response = await apiPost('/api/batch/create', formData);
      return response.ok;
    } catch (error) {
      console.error('Error creating batch:', error);
      return false;
    }
  },

  startBatch: async (id: number, isYard?: boolean) => {
    try {
      const response = await apiPost('/api/batch/start', { id, isYard });
      return response.ok;
    } catch (error) {
      console.error('Error starting batch:', error);
      return false;
    }
  },

  endBatch: async (id: number, expectedNetto: number, actualNetto: number) => {
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
  },

  loadVehicleHistory: async (vehicleId: any) => {
    try {
      const [historyRes, tarraRes] = await Promise.all([
        apiGet(`/api/vehicles/history?vehicleId=${vehicleId}`),
        apiGet(`/api/vehicles/tarra?vehicleId=${vehicleId}`),
      ]);

      const [historyData, tarraData] = await Promise.all([historyRes.json(), tarraRes.json()]);

      return {
        history: historyData || [],
        tarra: tarraData,
      };
    } catch (error) {
      console.error('Error loading vehicle history:', error);
      throw error;
    }
  },

  saveWeightRecord: async (
    batchId: number,
    weight: number,
    stable: boolean,
    transactionType: string,
    transactionId: any,
    status: string
  ) => {
    try {
      await apiPost('/api/weight/save', {
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

  loadListDocument: async (type: DocumentWbState) => {
    try {
      // Dynamic API endpoint based on type
      let endpoint = '/api/batch/list';

      switch (type) {
        case DocumentWbState.WEIGHING_QUEUE:
          endpoint = `/api/batch/list?status=${InboundStatus.QUEUE_IN}`;
          break;
        case DocumentWbState.YARD_QUEUE:
          endpoint = `/api/batch/list?status=${InboundStatus.YARD}`;
          break;
        // case DocumentWbState.WB_REJECT:
        //   endpoint = '/api/batch/list?status=wb_reject';
        //   break;
        // case DocumentWbState.CLOSE_WB:
        //   endpoint = '/api/batch/list?status=close_wb';
        //   break;
      }

      const response = await apiGet(endpoint);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error(`Error loading ${type}:`, error);
      throw error;
    }
  },
};
