'use client';

import { useEffect, useCallback } from 'react';
import { useWeighingStore } from '@/store/weighing.store';
import { useSysStore } from '@/store/sys.store';
import { useApiWeighing } from '@/hooks/useApiWeight.hook';
import { apiPost } from '@/utils/api';
import { DocumentWbState, InboundStatus } from '@/types/inbound.type';

export const useWeighing = () => {
  const store = useWeighingStore();
  const sysStore = useSysStore();
  const apiWeighing = useApiWeighing();

  // Gate Control
  const toggleGate = useCallback(async () => {
    store.setGateProcessing(true);

    // Simulate gate operation delay
    setTimeout(() => {
      store.setGateStatus(store.gateStatus === 'open' ? 'closed' : 'open');
      store.setGateProcessing(false);
    }, 1500);
  }, [store]);

  // Reject Document
  const rejectDocument = useCallback(
    async (reason: string) => {
      if (!store.currentBatch) return false;

      try {
        // TODO: Implement reject API call
        console.log('Rejecting document:', store.currentBatch.id, 'Reason:', reason);

        // Reset current batch after rejection
        store.setCurrentBatch(null);
        store.setBatchId(null);
        store.resetWeights();

        return true;
      } catch (error) {
        console.error('Error rejecting document:', error);
        return false;
      }
    },
    [store]
  );

  // Initialize data on mount (only once per session)
  useEffect(() => {
    const cacheKey = 'weighing-cache';
    const cached = localStorage.getItem(cacheKey);
    const now = Date.now();
    const cacheExpiry = 3 * 60 * 1000; // 3 minutes

    // let shouldInit = true;
    // if (cached) {
    //   const { timestamp } = JSON.parse(cached);
    //   shouldInit = now - timestamp > cacheExpiry;
    // }

    //if (shouldInit && !store.isLoading) {
    initializeData();
    //localStorage.setItem(cacheKey, JSON.stringify({ timestamp: now }));
    //}

    const timeCleanup = startTimeUpdater();
    return timeCleanup;
  }, []);

  //Weight simulation with batchId dependency
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (store.batchId && store.captureWeight === 0) {
      //console.log('🎯 Starting weight simulation for batchId:', store.batchId);
      cleanup = startWeightSimulation();
    } else {
      //console.log('⏸️ Weight simulation stopped - captureWeight:', store.captureWeight);
    }

    return () => {
      if (cleanup) {
        //console.log('🧹 Cleaning up weight simulation');
        cleanup();
      }
    };
  }, [store.batchId, store.captureWeight]);

  const initializeData = useCallback(async () => {
    if (store.isLoading) return;

    store.setLoading(true);

    try {
      // Load vehicle history with cache check
      //if (store.vehicleHistory.length === 0) {
      await loadVehicleHistory();
      //}

      store.setInitialized(true);
    } catch (error) {
      console.error('❌ Error initializing weighing data:', error);
      localStorage.removeItem('weighing-cache');
    } finally {
      store.setLoading(false);
    }
  }, [store, apiWeighing]);

  const startTimeUpdater = useCallback(() => {
    console.log('🕒 Starting time updater', store.batchId, store.currentBatch);
    const updateTime = () => {
      // Only update time if there's an active batch
      if (store.batchId || store.currentBatch) {
        const now = new Date();
        store.setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 3000);

    return () => clearInterval(interval);
  }, [store]);

  const startWeightSimulation = useCallback(() => {
    const simulateWeight = () => {
      let baseWeight = 35000;

      // Adjust base weight based on transaction type and status
      if (store.currentBatch?.inbound) {
        const { transactionType, status } = store.currentBatch.inbound;
        const existingWeighIn = store.currentBatch.inbound.weighIn?.weight;

        if (status === 'yard-processing' && existingWeighIn) {
          if (transactionType === 'RAW_MATERIAL') {
            // For incoming at yard, weight should be smaller than weighIn
            baseWeight = existingWeighIn * 0.6 + Math.random() * (existingWeighIn * 0.2);
          } else if (transactionType === 'DISPATCH') {
            // For dispatch at yard, weight should be larger than weighIn
            baseWeight = existingWeighIn * 1.1 + Math.random() * (existingWeighIn * 0.3);
          } else if (transactionType === 'MISCELLANEOUS') {
            if (store.miscCategory === 'TARRA') {
              // For MISC TARRA at yard, weight should be larger than weighIn
              baseWeight = existingWeighIn * 1.1 + Math.random() * (existingWeighIn * 0.3);
            } else if (store.miscCategory === 'BRUTTO') {
              // For MISC BRUTTO at yard, weight should be smaller than weighIn
              baseWeight = existingWeighIn * 0.6 + Math.random() * (existingWeighIn * 0.2);
            }
          }
        } else {
          baseWeight = 35000 + Math.random() * 1000;
        }
      }

      const fluctuation = (Math.random() - 0.5) * 100;
      const newWeight = Math.round(baseWeight + fluctuation);
      const stable = Math.random() > 0.3; // 70% chance of stable reading

      store.setWeightData({ currentWeight: newWeight, isStable: stable });

      // Auto-capture weights when stable
      if (stable) {
        if (store.brutoWeight === 0) {
          store.setWeightData({ brutoWeight: newWeight });
        } else if (store.tarraWeight === 0 && newWeight < store.brutoWeight * 0.7) {
          store.setWeightData({
            tarraWeight: newWeight,
            nettoWeight: store.brutoWeight - newWeight,
          });
        }
      }
    };

    const interval = setInterval(simulateWeight, 3000);
    return () => clearInterval(interval);
  }, [store]);

  const captureWeightRecordState = useCallback(async () => {
    if (!store.currentBatch || !store.isStable) return false;

    console.log('🎯 Capturing weight:', store.currentWeight);
    store.setWeightData({ captureWeight: store.currentWeight, isCaptureWeight: true });
    return true;
  }, [store]);

  const startWeightSimulationAgain = useCallback(() => {
    console.log('🔄 Starting weight simulation again');
    store.setWeightData({ captureWeight: 0, isCaptureWeight: false });
  }, [store]);

  const saveWeightRecordRejectedState = useCallback(
    async (rejectReason: string) => {
      if (!store.currentBatch) return false;

      try {
        sysStore.setLoadingState(true);
        const data = await apiWeighing.saveWeightRecord(
          store.currentBatch?.inbound.id,
          store.captureWeight,
          store.isStable,
          store.currentBatch?.inbound.transactionType,
          store.currentBatch?.inbound.transactionId,
          'rejected',
          rejectReason
        );

        // Update weight history
        // store.addWeightHistory({
        //   weight,
        //   timestamp: new Date(),
        //   stable,
        // });
        store.setCurrentBatch(null);
        store.setBatchId(null);
        store.resetWeights();
        sysStore.setLoadingState(false);
        return true;
      } catch (error) {
        console.error('Error saving weight record:', error);
        return false;
      }
    },
    [store, apiWeighing]
  );

  const saveWeightRecordState = useCallback(async () => {
    if (!store.currentBatch) return false;

    try {
      sysStore.setLoadingState(true);
      const data = await apiWeighing.saveWeightRecord(
        store.currentBatch.inbound.id,
        store.captureWeight,
        store.isStable,
        store.currentBatch.inbound.transactionType,
        store.currentBatch.inbound.transactionId,
        store.currentBatch.inbound.status
      );

      store.setCurrentBatch(null);
      store.setBatchId(null);
      store.resetWeights();
      sysStore.setLoadingState(false);
      return true;
    } catch (error) {
      console.error('Error saving weight record:', error);
      sysStore.setLoadingState(false);
      return false;
    }
  }, [store, apiWeighing, sysStore]);

  const createBatch = useCallback(async () => {
    try {
      const success = await apiWeighing.createBatch(store.formData);

      if (success) {
        alert('Batch created successfully');
        const batches = await apiWeighing.loadBatches();
        store.setBatches(batches);
        store.resetWeights();
        store.resetForm();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating batch:', error);
      return false;
    }
  }, [store, apiWeighing]);

  const startBatch = useCallback(
    async (id: any, isYard?: boolean) => {
      try {
        store.setBatchId(id);
        const success = await apiWeighing.startBatch(id, isYard, store.miscCategory);

        if (success) {
          const batch = await apiWeighing.loadDetailBatch(id);
          store.setCurrentBatch(batch);

          // Only load vehicle history if not already loaded
          if (store.vehicleHistory.length === 0) {
            await loadVehicleHistory();
          }

          return true;
        }
        return false;
      } catch (error) {
        console.error('Error starting batch:', error);
        return false;
      }
    },
    [store, apiWeighing]
  );

  const endBatch = useCallback(
    async (id: number) => {
      try {
        const expectedNetto = store.expectedNetto || store.nettoWeight;
        const result = await apiWeighing.endBatch(id, expectedNetto, store.nettoWeight);

        store.setShrinkageData(result.shrinkage);

        if (result.shrinkage?.warning) {
          alert(
            `WARNING: Shrinkage ${result.shrinkage.shrinkagePercent.toFixed(
              2
            )}% exceeds 0.2% threshold!`
          );
        }

        store.setBatches(null);
        store.setCurrentBatch(null);
        store.setBatchId(null);
        store.resetWeights();

        return true;
      } catch (error) {
        console.error('Error ending batch:', error);
        return false;
      }
    },
    [store, apiWeighing]
  );

  const loadVehicleHistory = useCallback(async () => {
    // Check if data is already loaded in store
    if (store.vehicleHistory.length > 0 && store.tarraHistory) {
      return;
    }

    try {
      const vehicleData = await apiWeighing.loadVehicleHistory();
      store.setVehicleData(vehicleData.history, vehicleData.tarra);
    } catch (error) {
      console.error('Error loading vehicle history:', error);
    }
  }, [store, apiWeighing]);

  const loadListDocument = useCallback(
    async (type: DocumentWbState) => {
      const now = Date.now();
      const cacheExpiry = 10 * 1000; // 30 seconds

      // Check cache
      if (
        store.lastDocumentType === type &&
        now - store.documentCacheTime < cacheExpiry &&
        store.listDocument.length > 0
      ) {
        return;
      }

      try {
        const data = await apiWeighing.loadListDocument(type);
        store.setListDocument(data);
        store.setCacheInfo(type, now);
      } catch (error) {
        console.error(`Error loading ${type}:`, error);
      }
    },
    [store, apiWeighing]
  );

  return {
    // State
    ...sysStore,
    ...store,
    InboundStatus,

    // Actions
    captureWeightRecordState,
    startWeightSimulationAgain,
    createBatch,
    startBatch,
    endBatch,
    saveWeightRecordState,
    loadVehicleHistory,
    loadListDocument,
    initializeData,
    toggleGate,
    rejectDocument,
  };
};
