import type { GeoPoint, Property } from '../../types';

export interface OverpassBounds {
  south: number;
  west: number;
  north: number;
  east: number;
}

export async function fetchOverpassBuildings(
  bounds: OverpassBounds,
  signal?: AbortSignal
): Promise<Property[]> {
  const query = `[out:json][timeout:15];
    (
      way["building"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
      relation["building"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
    );
    out center tags 50;`;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    signal,
  });
  if (!response.ok) throw new Error('Overpass request failed');
  const data = await response.json();

  return data.elements
    .filter((el: any) => el.center || (el.lat && el.lon))
    .map((el: any, idx: number) => {
      const center = el.center ?? { lat: el.lat, lon: el.lon };
      return {
        id: `overpass-${el.id ?? idx}`,
        address: el.tags?.['addr:street'] ?? 'Unknown address',
        city: el.tags?.['addr:city'] ?? '',
        state: el.tags?.['addr:state'] ?? '',
        zip: el.tags?.['addr:postcode'] ?? '',
        location: { lat: center.lat, lon: center.lon },
        squareFeet: undefined,
        yearBuilt: el.tags?.start_date ? parseInt(el.tags.start_date, 10) : undefined,
        lotSize: undefined,
      };
    });
}
