// backend/src/integrations/integrations.controller.ts
import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { JobNimbusAdapter } from './jobnimbus.adapter';

@Controller('integrations')
@UseGuards(JwtAuthGuard)
export class IntegrationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post('deals/:id/sync')
  async syncToExternalCrm(@Param('id') dealId: string, @Req() req: any) {
    const userId = req.user.id;
    
    // 1. Fetch connection details and credentials
    const connection = await this.prisma.integrationConnection.findUnique({
      where: {
        userId_provider: {
          userId,
          provider: 'JOBNIMBUS',
        },
      },
    });

    if (!connection) throw new Error('No integrated JobNimbus connection discovered.');

    // 2. Decrypt the Access Token at rest (using AES-GCM or KMS equivalent)
    const decryptedToken = this.decryptToken(connection.accessToken);

    // 3. Instantiate the adapter dynamically
    const adapter = new JobNimbusAdapter(decryptedToken);

    // 4. Retrieve internal Deal details
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId },
      include: { client: true },
    });

    if (!deal) throw new Error('Internal deal records not found');

    // 5. Trigger sync outward
    const { externalId } = await adapter.pushLead(deal.id, {
      companyName: deal.client.companyName,
      address: deal.notes || '',
      stage: deal.stage,
    });

    // 6. Update connection references
    await this.prisma.deal.update({
      where: { id: deal.id },
      data: {
        notes: `${deal.notes}\n[JobNimbus Synced ID]: ${externalId}`,
      },
    });

    return { success: true, externalId };
  }

  private decryptToken(token: string): string {
    // In production, invoke KMS service. Here we mock decryption:
    return Buffer.from(token, 'base64').toString('utf8');
  }
}
