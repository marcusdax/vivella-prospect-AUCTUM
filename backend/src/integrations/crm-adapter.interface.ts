// backend/src/integrations/crm-adapter.interface.ts
export interface CrmAdapter {
  pushLead(
    dealId: string,
    data: { companyName: string; address: string; stage: string }
  ): Promise<{ externalId: string }>;
  pushEstimate(externalLeadId: string, estimateXml: string): Promise<void>;
  pullStatus(externalLeadId: string): Promise<{ status: string }>;
}
