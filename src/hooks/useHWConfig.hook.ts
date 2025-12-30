'use client';

import { useState, useCallback } from 'react';
import { useApiHWConfig } from './useApiHWConfig.hook';
import { useAuth } from './useAuth';
import { HwConfigurationDto, UpsertHwConfigRequest } from '@/types/hw-configuration';
import { HwGeneralApiDto, UpsertHwGeneralApiRequest } from '@/types/hw-general-api';
import { HwAreaEnum } from '@/entities/HwConfiguration.entity';
import { HardwareService } from '@/services/hardware.service';
import { HardwarePermissionService } from '@/services/hardware-permission.service';
import { apiGet, apiPost } from '@/utils/api';
import { hwConfigDB } from '@/utils/hwConfigDB';

// Create separate enum for UI tabs
export enum HwTabEnum {
  GENERAL = 'GENERAL',
  REGISTERING = 'REGISTERING',
  WEIGHING_IN = 'WEIGHING-IN',
  WEIGHING_OUT = 'WEIGHING-OUT',
}

export const useHWConfig = () => {
  const { permissions } = useAuth();
  const permissionService = HardwarePermissionService.getInstance();
  const allowedAreas = permissionService.getAllowedAreas(permissions);

  const [selectedTab, setSelectedTab] = useState<HwTabEnum>(HwTabEnum.GENERAL);
  const [formData, setFormData] = useState({
    // General API
    hardware_api: '',
    // Area config
    gate: null as number | null,
    camera: null as number | null,
    lamp: null as number | null,
    topic_get_weight: '',
    topic_post_command: '',
  });
  const [currentConfig, setCurrentConfig] = useState<HwConfigurationDto | null>(null);
  const [generalApi, setGeneralApi] = useState<HwGeneralApiDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const api = useApiHWConfig();

  const handleUpsert = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (selectedTab === HwTabEnum.GENERAL) {
        // Save general API
        setIsDisabled(true);
        const response = await apiPost('/api/hw-general-api', { url: formData.hardware_api });
        const result = await response.json();

        if (result.success) {
          setGeneralApi(result.data);
          // Cache to IndexedDB
          if (result.data) {
            await hwConfigDB.setGeneralApi(result.data);
          }
          setIsDisabled(false);
        } else {
          setError(result.message || 'Failed to save general API');
        }
        return result;
      } else {
        // Save area config
        setIsDisabled(true);
        const area = selectedTab as unknown as HwAreaEnum;
        const request: UpsertHwConfigRequest = {
          area,
          dataConfig: {
            gate: formData.gate,
            camera: formData.camera,
            lamp: formData.lamp,
            mqtt:
              selectedTab === HwTabEnum.REGISTERING
                ? null
                : {
                    topic_get_weight: formData.topic_get_weight || null,
                    topic_post_command: formData.topic_post_command || null,
                  },
          },
        };

        const result = await api.upsert(request);
        if (result.success) {
          setCurrentConfig(result.data);
          // Cache to IndexedDB
          if (result.data) {
            await hwConfigDB.setAreaConfig(area, result.data);
          }
          setIsDisabled(false);
        } else {
          setError(result.message || 'Failed to save configuration');
        }
        return result;
      }
    } catch (err) {
      const message = 'Error saving configuration';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [api, selectedTab, formData]);

  const handleGetByArea = useCallback(
    async (area: HwAreaEnum) => {
      if (loading) return;

      setLoading(true);
      try {
        // Check IndexedDB first
        const cachedData = await hwConfigDB.getAreaConfig(area);
        if (cachedData) {
          setCurrentConfig(cachedData);
          setFormData((prev) => ({
            ...prev,
            gate: cachedData?.dataConfig?.gate || null,
            camera: cachedData?.dataConfig?.camera || null,
            lamp: cachedData?.dataConfig?.lamp || null,
            topic_get_weight: cachedData?.dataConfig?.mqtt?.topic_get_weight || '',
            topic_post_command: cachedData?.dataConfig?.mqtt?.topic_post_command || '',
          }));
          setLoading(false);
          return { success: true, data: cachedData };
        }

        // Fallback to API
        const result = await api.getByArea(area);
        if (result.success) {
          setCurrentConfig(result.data);
          // Cache the result
          if (result.data) {
            await hwConfigDB.setAreaConfig(area, result.data);
          }
          setFormData((prev) => ({
            ...prev,
            gate: result.data?.dataConfig?.gate || null,
            camera: result.data?.dataConfig?.camera || null,
            lamp: result.data?.dataConfig?.lamp || null,
            topic_get_weight: result.data?.dataConfig?.mqtt?.topic_get_weight || '',
            topic_post_command: result.data?.dataConfig?.mqtt?.topic_post_command || '',
          }));
        } else {
          setCurrentConfig(null);
          setFormData((prev) => ({
            ...prev,
            gate: null,
            camera: null,
            lamp: null,
            topic_get_weight: '',
            topic_post_command: '',
          }));
        }
        return result;
      } catch (err) {
        setCurrentConfig(null);
        console.error('Error fetching configuration:', err);
      } finally {
        setLoading(false);
      }
    },
    [api, loading]
  );

  const handleGetGeneralApi = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    try {
      // Check IndexedDB first
      const cachedData = await hwConfigDB.getGeneralApi();
      if (cachedData) {
        setGeneralApi(cachedData);
        setFormData((prev) => ({
          ...prev,
          hardware_api: cachedData?.url || '',
        }));
        setLoading(false);
        return { success: true, data: cachedData };
      }

      // Fallback to API
      const response = await apiGet('/api/hw-general-api');
      const result = await response.json();

      if (result.success) {
        setGeneralApi(result.data);
        // Cache the result
        if (result.data) {
          await hwConfigDB.setGeneralApi(result.data);
        }
        setFormData((prev) => ({
          ...prev,
          hardware_api: result.data?.url || '',
        }));
      } else {
        setGeneralApi(null);
        setFormData((prev) => ({ ...prev, hardware_api: '' }));
        setError(result.message);
      }
      return result;
    } catch (err) {
      setGeneralApi(null);
      setError('Failed to fetch general API configuration');
      console.error('Error fetching general API:', err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleCancel = useCallback(() => {
    if (selectedTab === HwTabEnum.GENERAL) {
      setFormData((prev) => ({
        ...prev,
        hardware_api: generalApi?.url || '',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        gate: currentConfig?.dataConfig?.gate || null,
        camera: currentConfig?.dataConfig?.camera || null,
        lamp: currentConfig?.dataConfig?.lamp || null,
        topic_get_weight: currentConfig?.dataConfig?.mqtt?.topic_get_weight || '',
        topic_post_command: currentConfig?.dataConfig?.mqtt?.topic_post_command || '',
      }));
    }
    setError(null);
  }, [selectedTab, currentConfig, generalApi]);

  const handleTest = useCallback(
    async (type: 'hardware' | 'weight') => {
      const url = type === 'hardware' ? formData.hardware_api : formData.weight_topic;

      if (!url) {
        alert(`Please enter ${type} URL first`);
        return;
      }

      if (type === 'weight') {
        alert(`Testing MQTT topic: ${url}\nNote: MQTT testing requires separate implementation`);
        return;
      }

      try {
        const hardwareService = HardwareService.getInstance();
        const result = await hardwareService.testConnection(url);

        if (result.success) {
          alert(`✅ HARDWARE API connection successful!`);
        } else {
          alert(`❌ HARDWARE API connection failed: ${result.message}`);
        }
      } catch (error) {
        alert(`❌ HARDWARE API test error: ${error}`);
      }
    },
    [formData]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    allowedAreas,
    selectedTab,
    setSelectedTab,
    formData,
    setFormData,
    currentConfig,
    generalApi,
    loading,
    error,
    save: handleUpsert,
    getByArea: handleGetByArea,
    getGeneralApi: handleGetGeneralApi,
    cancel: handleCancel,
    test: handleTest,
    clearError,
    isDisabled,
  };
};
