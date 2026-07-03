import { useQuery } from '@tanstack/react-query';
import { getProperties } from '../services/properties/propertyAdapter';

export function useMapProperties() {
  return useQuery({
    queryKey: ['map-properties'],
    queryFn: getProperties,
  });
}
