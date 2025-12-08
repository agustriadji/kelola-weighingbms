/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SysMenuState } from '@/types/sys.type';

export const useSysStore = create<SysMenuState>()(
  persist(
    (set) => ({
      // Initial State
      loadingState: false,
      activeMenuState: 'dashboard',
      setLoadingState: (loadingState: boolean) => set({ loadingState }),
      setActiveMenuState: (activeMenu: string) => set({ activeMenuState: activeMenu }),
      activeModalState: '',
      setActiveModalState: (activeModal: string) => set({ activeModalState: activeModal }),
      resetModalState: () => set({ activeMenuState: 'dashboard' }),
    }),
    {
      name: 'sys-weighing',
      storage:
        typeof window !== 'undefined'
          ? {
              getItem: (name) => {
                const str = localStorage.getItem(name);
                return str ? JSON.parse(str) : null;
              },
              setItem: (name, value) => {
                localStorage.setItem(name, JSON.stringify(value));
              },
              removeItem: (name) => localStorage.removeItem(name),
            }
          : undefined,
    }
  )
);
