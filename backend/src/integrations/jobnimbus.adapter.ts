// backend/src/integrations/jobnimbus.adapter.ts
import { Injectable } from '@nestjs/common';
import { CrmAdapter } from './crm-adapter.interface';

@Injectable()
export class JobNimbusAdapter implements CrmAdapter {
  constructor(private readonly accessToken: string) {}

  async pushLead(
    dealId: string,
    data: { companyName: string; address: string; stage: string }
  ): Promise<{ externalId: string }> {
    const response = await fetch('https://app.jobnimbus.com/api1/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        display_name: data.companyName,
        address_line1: data.address,
        status_name: data.stage,
        source_name: 'Atlas',
      }),
    });

    if (!response.ok) {
      throw new Error(`JobNimbus API push failed: ${response.statusText}`);
    }

    const json = await response.json();
    return { externalId: json.jnid };
  }

  async pushEstimate(externalLeadId: string, estimateXml: string): Promise<void> {
    const response = await fetch(`https://app.jobnimbus.com/api1/contacts/${externalLeadId}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/xml',
      },
      body: estimateXml,
    });

    if (!response.ok) {
      throw new Error(`JobNimbus estimate upload failed: ${response.statusText}`);
    }
  }

  async pullStatus(externalLeadId: string): Promise<{ status: string }> {
    const response = await fetch(`https://app.jobnimbus.com/api1/contacts/${externalLeadId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`JobNimbus status pull failed: ${response.statusText}`);
    }

    const json = await response.json();
    return { status: json.status_name };
  }
}
