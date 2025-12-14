/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  WeighingState,
  ListDocumentState,
  WeighingFormData,
  InboundStatus,
} from '@/types/inbound.type';

export const useWeighingStore = create<WeighingState>()(
  persist(
    (set) => ({
      // Initial State
      currentTime: '',
      suppliers: [],
      materials: [],
      vehicles: [],
      batches: [],
      batchId: null,
      currentBatch: null,
      currentWeight: 0,
      captureWeight: 0,
      isStable: false,
      isCaptureWeight: false,
      miscCategory: '',
      weightHistory: [],
      brutoWeight: 0,
      tarraWeight: 0,
      nettoWeight: 0,
      expectedNetto: 0,
      shrinkageData: null,
      vehicleHistory: [],
      tarraHistory: null,
      formData: {
        batchName: '',
        vehicleId: '',
        supplierId: '',
        materialId: '',
        driverName: '',
        ticketNumber: '',
      },
      listDocument: [],
      isLoading: false,
      isInitialized: false,
      lastDocumentType: null,
      documentCacheTime: 0,
      activeListWeighingState: 'weighing',
      showActiveWeighState: false,

      // Gate Control
      gateStatus: 'closed',
      gateProcessing: false,

      // Reject Control
      rejectModalOpen: false,
      rejectReason: '',

      // Actions
      setActiveListWeighingState: (listActiveWeigh: string) =>
        set({ activeListWeighingState: listActiveWeigh }),

      setShowActiveWeighState: (showActiveWeigh: boolean) =>
        set({ showActiveWeighState: showActiveWeigh }),

      setCurrentTime: (time: string) => set({ currentTime: time }),

      setMasterData: (suppliers: any[], materials: any[], vehicles: any[]) =>
        set({ suppliers, materials, vehicles }),

      setBatches: (batches: any[]) => {
        const current = batches?.find(
          (b: any) => b.status === InboundStatus.WEIGHED_IN || b.status === InboundStatus.QUEUE_IN
        );
        set({ batches, currentBatch: current || null });
      },

      setCurrentBatch: (batch: any | null) => set({ currentBatch: batch }),

      setWeightData: (data) => set((state) => ({ ...state, ...data })),

      addWeightHistory: (record: any) =>
        set((state) => ({
          weightHistory: [record, ...state.weightHistory.slice(0, 9)],
        })),

      setVehicleData: (history: any[], tarra: any) =>
        set({ vehicleHistory: history, tarraHistory: tarra }),

      setShrinkageData: (data: any) => set({ shrinkageData: data }),

      setFormData: (data: Partial<WeighingFormData>) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetWeights: () =>
        set({
          brutoWeight: 0,
          tarraWeight: 0,
          nettoWeight: 0,
          expectedNetto: 0,
          currentWeight: 0,
          captureWeight: 0,
          isCaptureWeight: false,
          miscCategory: '',
          weightHistory: [],
          shrinkageData: null,
          currentBatch: null,
          batchId: null,
        }),

      resetForm: () =>
        set({
          formData: {
            batchName: '',
            vehicleId: '',
            supplierId: '',
            materialId: '',
            driverName: '',
            ticketNumber: '',
          },
        }),

      setListDocument: (data: ListDocumentState[]) => set({ listDocument: data }),
      setBatchId: (id: number | null) => set({ batchId: id }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setInitialized: (initialized: boolean) => set({ isInitialized: initialized }),
      setCacheInfo: (type: string, time: number) =>
        set({ lastDocumentType: type, documentCacheTime: time }),
      saveWeightState: (brutoWeight) => set({ isLoading: true, brutoWeight }),

      // Gate Control Actions
      setGateStatus: (status: 'open' | 'closed') => set({ gateStatus: status }),
      setGateProcessing: (processing: boolean) => set({ gateProcessing: processing }),

      // Reject Control Actions
      setRejectModalOpen: (open: boolean) => set({ rejectModalOpen: open }),
      setRejectReason: (reason: string) => set({ rejectReason: reason }),

      // Miscellaneous Category Actions
      setMiscCategory: (category: string) => set({ miscCategory: category }),
    }),
    {
      name: 'weighing-store',
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        suppliers: state.suppliers,
        materials: state.materials,
        vehicles: state.vehicles,
        batches: state.batches,
        currentBatch: state.currentBatch,
        batchId: state.batchId,
        captureWeight: state.captureWeight,
        isCaptureWeight: state.isCaptureWeight,
        miscCategory: state.miscCategory,
        listDocument: state.listDocument,
        lastDocumentType: state.lastDocumentType,
        documentCacheTime: state.documentCacheTime,
      }),
    }
  )
);
