'use client';

import { useCallback } from 'react';
import { apiPost } from '@/utils/api';

export const useApiAuth = () => {
  const login = useCallback(async ({ username, password }) => {
    try {
      const response = await apiPost('/api/auth/login', { username, password });
      const data = response.json();
      return data || [];
    } catch (error) {
      console.error('Error loading batches:', error);
      throw error;
    }
  }, []);

  return {
    login,
  };
};
