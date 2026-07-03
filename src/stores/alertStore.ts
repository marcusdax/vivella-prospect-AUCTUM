import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Alert } from '../types';

interface AlertState {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id' | 'createdAt' | 'read'>) => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set, get) => ({
      alerts: [],
      addAlert: (alert) => {
        const newAlert: Alert = {
          ...alert,
          id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set({ alerts: [newAlert, ...get().alerts] });
      },
      markRead: (id) => {
        set({ alerts: get().alerts.map((a) => (a.id === id ? { ...a, read: true } : a)) });
      },
      clearAll: () => set({ alerts: [] }),
    }),
    {
      name: 'vivella-alerts',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
