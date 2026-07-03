import type { Prospect, InvestmentStrategy } from '../../types';
import { mockProperties } from '../properties/mockProperties';

function strategyScore(propertyId: string, strategy: InvestmentStrategy): number {
  let seed = propertyId.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  seed = (seed * 9301 + 49297) % 233280;
  const base = seed % 100;
  if (strategy === 'fix-and-flip') return base + 12;
  if (strategy === 'buy-and-hold') return base + 5;
  return base;
}

export async function getProspects(filters?: {
  strategy?: InvestmentStrategy;
  minEquity?: number;
  maxPrice?: number;
}): Promise<Prospect[]> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  let prospects = mockProperties.map((property) => {
    const strategy: InvestmentStrategy = filters?.strategy ?? 'fix-and-flip';
    const estimatedArv = Math.round((property.lastSalePrice ?? 400000) * 1.35);
    const estimatedRehabCost = Math.round((estimatedArv - (property.lastSalePrice ?? 0)) * 0.55);
    const estimatedEquity = estimatedArv - (property.lastSalePrice ?? 0) - estimatedRehabCost;
    const cashOnCashReturn = Math.round((estimatedEquity / Math.max(estimatedRehabCost, 1)) * 100);
    const monthlyCashFlow = Math.round(estimatedArv * 0.0075);
    return {
      id: `prospect-${property.id}`,
      propertyId: property.id,
      property,
      strategy,
      estimatedArv,
      estimatedRehabCost,
      estimatedEquity,
      cashOnCashReturn,
      monthlyCashFlow,
      score: strategyScore(property.id, strategy),
    };
  });

  if (filters?.minEquity !== undefined) {
    prospects = prospects.filter((p) => p.estimatedEquity >= filters.minEquity!);
  }
  if (filters?.maxPrice !== undefined) {
    prospects = prospects.filter((p) => (p.property.lastSalePrice ?? Infinity) <= filters.maxPrice!);
  }
  return prospects.sort((a, b) => b.score - a.score);
}

export async function getProspect(id: string): Promise<Prospect | undefined> {
  const prospects = await getProspects();
  return prospects.find((p) => p.id === id || p.propertyId === id);
}
