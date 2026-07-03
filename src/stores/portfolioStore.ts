import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PortfolioItemType = 'watchlist' | 'owned';

export interface PortfolioItem {
  propertyId: string;
  type: PortfolioItemType;
  addedAt: string;
  notes?: string;
}

interface PortfolioState {
  items: PortfolioItem[];
  addItem: (propertyId: string, type: PortfolioItemType) => void;
  removeItem: (propertyId: string) => void;
  updateNotes: (propertyId: string, notes: string) => void;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (propertyId, type) => {
        const items = get().items.filter((i) => i.propertyId !== propertyId);
        items.push({ propertyId, type, addedAt: new Date().toISOString() });
        set({ items });
      },
      removeItem: (propertyId) => {
        set({ items: get().items.filter((i) => i.propertyId !== propertyId) });
      },
      updateNotes: (propertyId, notes) => {
        set({
          items: get().items.map((i) => (i.propertyId === propertyId ? { ...i, notes } : i)),
        });
      },
    }),
    {
      name: 'vivella-portfolio',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
