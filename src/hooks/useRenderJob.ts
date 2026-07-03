import { useQuery } from '@tanstack/react-query';
import { getRenderJob } from '../services/renderer/mockRendererAdapter';

export function useRenderJob(id: string) {
  return useQuery({
    queryKey: ['render-job', id],
    queryFn: () => getRenderJob(id),
    enabled: !!id,
    refetchInterval: (query) => {
      const data = query.state.data;
      return data?.status === 'processing' ? 1000 : false;
    },
  });
}
