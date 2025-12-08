'use client';

import { useEffect, useCallback } from 'react';
import { useWeighingStore } from '@/store/weighing.store';
import { useSysStore } from '@/store/sys.store';
import { weighingContext } from '@/contexts/weighing.context';
import { DocumentWbState, InboundStatus } from '@/types/inbound.type';

export const useWeighing = () => {
  const store = useWeighingStore();
  const sysStore = useSysStore();

  // Initialize data on mount (only once per session)
  useEffect(() => {
    const sessionKey = 'weighing-initialized';
    const isSessionInitialized = sessionStorage.getItem(sessionKey);

    if (!isSessionInitialized && !store.isLoading) {
      initializeData();
      sessionStorage.setItem(sessionKey, 'true');
    }

    startTimeUpdater();
    startWeightSimulation();
  }, []);

  const initializeData = useCallback(async () => {
    if (store.isLoading) return;

    store.setLoading(true);

    try {
      // Load master data
      const masterData = await weighingContext.loadMasterData();
      store.setMasterData(masterData.suppliers, masterData.materials, masterData.vehicles);

      // Load vehicle history if current batch exists
      if (store.currentBatch?.inbound) {
        const { vehicle_number } = store.currentBatch?.inbound;
        const vehicleData = await weighingContext.loadVehicleHistory(vehicle_number);
        store.setVehicleData(vehicleData.history, vehicleData.tarra);
      }

      store.setInitialized(true);
    } catch (error) {
      console.error('❌ Error initializing weighing data:', error);
      sessionStorage.removeItem('weighing-initialized'); // Reset on error
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  const startTimeUpdater = useCallback(() => {
    const updateTime = () => {
      const now = new Date();
      store.setCurrentTime(now.toLocaleTimeString('id-ID', { hour12: false }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [store]);

  const startWeightSimulation = useCallback(() => {
    const simulateWeight = () => {
      if (
        store.currentBatch?.inbound.status === InboundStatus.WEIGHING_IN ||
        store.currentBatch?.inbound.status === InboundStatus.WEIGHING_OUT
      ) {
        // Simulate realistic weight fluctuation
        const baseWeight = 35000 + Math.random() * 1000;
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

        // Save weight record
        //saveWeightRecord(newWeight, stable);
      }
    };

    const interval = setInterval(simulateWeight, 2000);
    return () => clearInterval(interval);
  }, [store]);

  const saveWeightRecordState = useCallback(
    async (weight: number, stable: boolean) => {
      if (!store.currentBatch) return false;

      try {
        const data = await weighingContext.saveWeightRecord(
          store.currentBatch?.inbound.id,
          weight,
          stable,
          store.currentBatch?.inbound.transactionType,
          store.currentBatch?.inbound.transactionId,
          store.currentBatch?.inbound.status
        );

        // Update weight history
        store.addWeightHistory({
          weight,
          timestamp: new Date(),
          stable,
        });
        store.setCurrentBatch(null);
        store.setBatchId(null);
        store.resetWeights();

        return true;
      } catch (error) {
        console.error('Error saving weight record:', error);
        return false;
      }
    },
    [store]
  );

  const createBatch = useCallback(async () => {
    try {
      const success = await weighingContext.createBatch(store.formData);

      if (success) {
        alert('Batch created successfully');
        const batches = await weighingContext.loadBatches();
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
  }, [store]);

  const startBatch = useCallback(
    async (id: any, isYard?: boolean) => {
      try {
        store.setBatchId(id);
        const success = await weighingContext.startBatch(id, isYard);

        if (success) {
          const batch = await weighingContext.loadDetailBatch(id);

          store.setCurrentBatch(batch);
          return true;
        }
        return false;
      } catch (error) {
        console.error('Error starting batch:', error);
        return false;
      }
    },
    [store]
  );

  const endBatch = useCallback(
    async (id: number) => {
      try {
        const expectedNetto = store.expectedNetto || store.nettoWeight;
        const result = await weighingContext.endBatch(id, expectedNetto, store.nettoWeight);

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
    [store]
  );

  const loadVehicleHistory = useCallback(
    async (vehicleId: number) => {
      try {
        const vehicleData = await weighingContext.loadVehicleHistory(vehicleId);
        store.setVehicleData(vehicleData.history, vehicleData.tarra);
      } catch (error) {
        console.error('Error loading vehicle history:', error);
      }
    },
    [store]
  );

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
        const data = await weighingContext.loadListDocument(type);
        store.setListDocument(data);
        store.setCacheInfo(type, now);
      } catch (error) {
        console.error(`Error loading ${type}:`, error);
      }
    },
    [store]
  );

  return {
    // State
    ...sysStore,
    ...store,

    // Actions
    createBatch,
    startBatch,
    endBatch,
    saveWeightRecordState,
    loadVehicleHistory,
    loadListDocument,
    initializeData,
  };
};
