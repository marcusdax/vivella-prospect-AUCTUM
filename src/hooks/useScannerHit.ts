import { useQuery } from '@tanstack/react-query';
import { getScannerHit } from '../services/scanner/mockScannerAdapter';

export function useScannerHit(id: string) {
  return useQuery({
    queryKey: ['scanner-hit', id],
    queryFn: () => getScannerHit(id),
    enabled: !!id,
  });
}
