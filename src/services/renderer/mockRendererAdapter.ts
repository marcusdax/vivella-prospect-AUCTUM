import type { RenderJob, RenderPreset } from '../../types';
import { getPropertyById } from '../properties/mockProperties';

export const presetLabels: Record<RenderPreset, string> = {
  paint: 'Fresh exterior paint',
  roof: 'New architectural shingle roof',
  windows: 'Modern vinyl window replacement',
  landscaping: 'Cleaned landscaping and walkway',
  'full-facade': 'Complete facade renovation',
};

const jobs: RenderJob[] = [];

export async function createRenderJob(
  propertyId: string,
  preset: RenderPreset,
  customImage?: string,
  upgrades?: string
): Promise<RenderJob> {
  let property = getPropertyById(propertyId);
  
  if (propertyId === 'custom') {
    property = {
      id: 'custom-upload',
      address: 'Uploaded Custom Structure',
      city: 'Local',
      state: 'Scan',
      zip: '00000',
      location: { lat: 0, lon: 0 },
    };
  }

  if (!property) throw new Error(`Property ${propertyId} not found`);

  const beforeUrl = customImage || `https://placehold.co/600x400/5C3D2E/F5F0EB?text=Before:+${encodeURIComponent(
    property.address
  )}`;

  const job: RenderJob = {
    id: `render-${Date.now()}`,
    propertyId,
    property,
    preset,
    status: 'queued',
    beforeImageUrl: beforeUrl,
    createdAt: new Date().toISOString(),
    upgrades,
    isCustomUpload: propertyId === 'custom',
  };
  jobs.unshift(job);

  setTimeout(() => {
    job.status = 'processing';
    setTimeout(() => {
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      
      const afterText = upgrades 
        ? `Upgraded: ${upgrades}` 
        : presetLabels[preset];
        
      job.afterImageUrl = `https://placehold.co/600x400/D4A24A/5C3D2E?text=After:+${encodeURIComponent(
        afterText.substring(0, 45) + (afterText.length > 45 ? '...' : '')
      )}`;
    }, 3000);
  }, 500);

  return job;
}

export async function getRenderJobs(): Promise<RenderJob[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...jobs];
}

export async function getRenderJob(id: string): Promise<RenderJob | undefined> {
  return jobs.find((j) => j.id === id);
}
