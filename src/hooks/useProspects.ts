import { useQuery } from '@tanstack/react-query';
import { getProspects } from '../services/prospector/mockProspectorAdapter';
import type { InvestmentStrategy } from '../types';

export function useProspects(filters?: {
  strategy?: InvestmentStrategy;
  minEquity?: number;
  maxPrice?: number;
}) {
  return useQuery({
    queryKey: ['prospects', filters],
    queryFn: () => getProspects(filters),
  });
}
