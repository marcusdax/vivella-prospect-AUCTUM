export interface GeoPoint {
  lat: number;
  lon: number;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  location: GeoPoint;
  thumbnailUrl?: string;
  squareFeet?: number;
  yearBuilt?: number;
  lotSize?: number;
  owner?: string;
  lastSaleDate?: string;
  lastSalePrice?: number;
}

export type ConditionIssueType = 'roof' | 'paint' | 'windows' | 'structural' | 'landscaping';
export type ConditionSeverity = 'critical' | 'high' | 'moderate' | 'low';

export interface ConditionIssue {
  id: string;
  type: ConditionIssueType;
  severity: ConditionSeverity;
  description: string;
  confidence: number;
  evidenceImageUrl?: string;
}

export interface ScannerHit {
  id: string;
  propertyId: string;
  property: Property;
  detectedAt: string;
  issues: ConditionIssue[];
  overallScore: number;
}

export type RenderPreset = 'paint' | 'roof' | 'windows' | 'landscaping' | 'full-facade';
export type RenderStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface RenderJob {
  id: string;
  propertyId: string;
  property: Property;
  preset: RenderPreset;
  status: RenderStatus;
  beforeImageUrl: string;
  afterImageUrl?: string;
  createdAt: string;
  completedAt?: string;
  upgrades?: string;
  isCustomUpload?: boolean;
}

export type InvestmentStrategy = 'fix-and-flip' | 'buy-and-hold' | 'wholesale';

export interface Prospect {
  id: string;
  propertyId: string;
  property: Property;
  strategy: InvestmentStrategy;
  estimatedArv: number;
  estimatedRehabCost: number;
  estimatedEquity: number;
  cashOnCashReturn?: number;
  monthlyCashFlow?: number;
  score: number;
}

export type AlertType = 'scanner' | 'render' | 'prospect';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  severity?: ConditionSeverity;
  targetId: string;
  targetScreen: 'scanner' | 'render' | 'prospector';
  createdAt: string;
  read: boolean;
}
