'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { setLocalStorage, getLocalStorage, removeLocalStorage } from '@/utils/storage';

export const useNav = () => {
  const nameSpace = 'menuHeaderState';
  const [menuHeaderState, setMenuHeaderState] = useState('');
  const { logout } = useAuth();

  const changeActive = async (url: string) => {
    if (menuHeaderState != url) {
      setMenuHeaderState(url);
      setLocalStorage(nameSpace, url);
      return url;
    }
    return null;
  };

  useEffect(() => {
    const { data } = getLocalStorage(nameSpace);
    if (data) {
      setMenuHeaderState(data);
    }
  }, []);

  const handlerLogout = async () => {
    removeLocalStorage(nameSpace);
    logout();
  };

  return {
    handlerLogout,
    changeActive,
    menuHeaderState,
  };
};
