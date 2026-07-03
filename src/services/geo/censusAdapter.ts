export async function fetchCensusTractData(lat: number, lon: number): Promise<{
  medianIncome?: number;
  population?: number;
}> {
  const url = `https://geocoding.geo.census.gov/geocoder/geographies/coordinates?x=${lon}&y=${lat}&benchmark=4&vintage=4&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Census geocoder failed');
  const data = await response.json();
  return {
    medianIncome: undefined,
    population: undefined,
  };
}
