import type { Property } from '../../types';
import { mockProperties } from './mockProperties';

export async function getProperties(): Promise<Property[]> {
  return [...mockProperties];
}

export async function getProperty(id: string): Promise<Property | undefined> {
  return mockProperties.find((p) => p.id === id);
}
