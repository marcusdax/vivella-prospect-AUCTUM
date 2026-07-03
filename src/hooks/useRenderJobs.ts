import { useQuery } from '@tanstack/react-query';
import { getRenderJobs } from '../services/renderer/mockRendererAdapter';

export function useRenderJobs() {
  return useQuery({
    queryKey: ['render-jobs'],
    queryFn: getRenderJobs,
  });
}
