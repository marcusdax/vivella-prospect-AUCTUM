import { useQuery } from '@tanstack/react-query';
import { getProspect } from '../services/prospector/mockProspectorAdapter';

export function useProspect(id: string) {
  return useQuery({
    queryKey: ['prospect', id],
    queryFn: () => getProspect(id),
    enabled: !!id,
  });
}
