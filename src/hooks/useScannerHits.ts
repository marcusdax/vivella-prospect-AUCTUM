import { useQuery } from '@tanstack/react-query';
import { getScannerHits } from '../services/scanner/mockScannerAdapter';

export function useScannerHits(filters?: { issueTypes?: string[]; minConfidence?: number }) {
  return useQuery({
    queryKey: ['scanner-hits', filters],
    queryFn: () => getScannerHits(filters),
  });
}
