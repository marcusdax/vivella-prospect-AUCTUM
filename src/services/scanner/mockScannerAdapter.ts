import type { ScannerHit, ConditionIssue, ConditionSeverity, ConditionIssueType } from '../../types';
import { mockProperties } from '../properties/mockProperties';

const issueTypes: ConditionIssueType[] = ['roof', 'paint', 'windows', 'structural', 'landscaping'];
const severities: ConditionSeverity[] = ['critical', 'high', 'moderate', 'low'];

function deterministicIssues(propertyId: string): ConditionIssue[] {
  const issues: ConditionIssue[] = [];
  let seed = propertyId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const count = (seed % 3) + 1;
  for (let i = 0; i < count; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    const type = issueTypes[seed % issueTypes.length];
    seed = (seed * 9301 + 49297) % 233280;
    const severity = severities[seed % severities.length];
    const descriptions: Record<ConditionIssueType, string> = {
      roof: 'Visible granule loss and edge curling detected.',
      paint: 'Fading and peeling paint on south-facing facade.',
      windows: 'Older single-pane windows with visible frame rot.',
      structural: 'Minor foundation cracking visible at driveway.',
      landscaping: 'Overgrown vegetation contacting structure.',
    };
    seed = (seed * 9301 + 49297) % 233280;
    const confidence = 55 + (seed % 40);
    issues.push({
      id: `${propertyId}-issue-${i}`,
      type,
      severity,
      description: descriptions[type],
      confidence: confidence / 100,
    });
  }
  return issues;
}

function severityScore(severity: ConditionSeverity): number {
  switch (severity) {
    case 'critical':
      return 100;
    case 'high':
      return 75;
    case 'moderate':
      return 50;
    case 'low':
      return 25;
  }
}

export async function getScannerHits(filters?: {
  issueTypes?: string[];
  minConfidence?: number;
}): Promise<ScannerHit[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  let hits = mockProperties.map((property) => {
    const issues = deterministicIssues(property.id);
    const overallScore = Math.round(
      issues.reduce((sum, issue) => sum + severityScore(issue.severity) * issue.confidence, 0) /
        Math.max(issues.length, 1)
    );
    return {
      id: `scan-${property.id}`,
      propertyId: property.id,
      property,
      detectedAt: new Date().toISOString(),
      issues,
      overallScore,
    };
  });

  if (filters?.issueTypes?.length) {
    hits = hits.filter((hit) =>
      hit.issues.some((issue) => filters.issueTypes?.includes(issue.type))
    );
  }
  if (filters?.minConfidence !== undefined) {
    hits = hits.filter((hit) =>
      hit.issues.some((issue) => issue.confidence >= filters.minConfidence!)
    );
  }
  return hits.sort((a, b) => b.overallScore - a.overallScore);
}

export async function getScannerHit(id: string): Promise<ScannerHit | undefined> {
  const hits = await getScannerHits();
  return hits.find((h) => h.id === id || h.propertyId === id);
}