'use client';

import { useCallback } from 'react';
import { apiGet, apiPost, apiDelete } from '@/utils/api';
import { UpsertHwConfigRequest } from '@/types/hw-configuration';
import { HwAreaEnum } from '@/entities/HwConfiguration.entity';

export const useApiHWConfig = () => {
  const upsert = useCallback(async (data: UpsertHwConfigRequest) => {
    try {
      const response = await apiPost('/api/hw-configuration', data);
      return response.json();
    } catch (error) {
      console.error('Error upserting hw config:', error);
      throw error;
    }
  }, []);

  const getByArea = useCallback(async (area: HwAreaEnum) => {
    try {
      const response = await apiGet(`/api/hw-configuration/${area}`);
      return response.json();
    } catch (error) {
      console.error('Error getting hw config:', error);
      throw error;
    }
  }, []);

  const getAll = useCallback(async () => {
    try {
      const response = await apiGet('/api/hw-configuration');
      return response.json();
    } catch (error) {
      console.error('Error getting all hw configs:', error);
      throw error;
    }
  }, []);

  const remove = useCallback(async (area: HwAreaEnum) => {
    try {
      const response = await apiDelete(`/api/hw-configuration/${area}`);
      return response.json();
    } catch (error) {
      console.error('Error removing hw config:', error);
      throw error;
    }
  }, []);

  return {
    upsert,
    getByArea,
    getAll,
    remove,
  };
};