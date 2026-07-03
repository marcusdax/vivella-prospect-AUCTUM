import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
  useLiveGeo: boolean;
  mapStyle: 'light' | 'satellite';
  setUseLiveGeo: (value: boolean) => void;
  setMapStyle: (value: 'light' | 'satellite') => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      useLiveGeo: process.env.EXPO_PUBLIC_USE_LIVE_GEO === 'true',
      mapStyle: 'light',
      setUseLiveGeo: (value) => set({ useLiveGeo: value }),
      setMapStyle: (value) => set({ mapStyle: value }),
    }),
    {
      name: 'vivella-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
