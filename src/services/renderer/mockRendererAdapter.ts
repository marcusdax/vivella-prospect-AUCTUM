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
  preset: RenderPreset
): Promise<RenderJob> {
  const property = getPropertyById(propertyId);
  if (!property) throw new Error(`Property ${propertyId} not found`);

  const job: RenderJob = {
    id: `render-${Date.now()}`,
    propertyId,
    property,
    preset,
    status: 'queued',
    beforeImageUrl: `https://placehold.co/600x400/5C3D2E/F5F0EB?text=Before:+${encodeURIComponent(
      property.address
    )}`,
    createdAt: new Date().toISOString(),
  };
  jobs.unshift(job);

  setTimeout(() => {
    job.status = 'processing';
    setTimeout(() => {
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.afterImageUrl = `https://placehold.co/600x400/D4A24A/5C3D2E?text=After:+${encodeURIComponent(
        presetLabels[preset]
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
