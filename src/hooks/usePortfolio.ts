import { usePortfolioStore, type PortfolioItem } from '../stores/portfolioStore';
import { mockProperties } from '../services/properties/mockProperties';
import type { Property } from '../types';

export interface PortfolioItemWithProperty extends PortfolioItem {
  property: Property;
}

export function usePortfolio() {
  const { items, addItem, removeItem, updateNotes } = usePortfolioStore();
  const enrichedItems = items
    .map((item) => {
      const property = mockProperties.find((p) => p.id === item.propertyId);
      return property ? { ...item, property } : null;
    })
    .filter((item): item is PortfolioItemWithProperty => item !== null);
  return { items: enrichedItems, addItem, removeItem, updateNotes };
}
