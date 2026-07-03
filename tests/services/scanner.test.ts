import { getScannerHits } from '../../src/services/scanner/mockScannerAdapter';

describe('mockScannerAdapter', () => {
  it('returns hits sorted by overall score', async () => {
    const hits = await getScannerHits();
    expect(hits.length).toBeGreaterThan(0);
    for (let i = 0; i < hits.length - 1; i++) {
      expect(hits[i].overallScore).toBeGreaterThanOrEqual(hits[i + 1].overallScore);
    }
  });

  it('filters by issue type', async () => {
    const hits = await getScannerHits({ issueTypes: ['roof'] });
    expect(hits.every((h) => h.issues.some((i) => i.type === 'roof'))).toBe(true);
  });
});
