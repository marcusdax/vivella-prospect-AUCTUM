// backend/src/crm/crm.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DealStage } from '@prisma/client';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async createClientFromAnalysis(
    userId: string,
    analysisId: string,
    companyName: string,
    address: string
  ) {
    // Transaction ensuring both Client and corresponding Deal are created atomically
    return this.prisma.$transaction(async (tx) => {
      const client = await tx.client.create({
        data: {
          userId,
          companyName,
        },
      });

      const deal = await tx.deal.create({
        data: {
          clientId: client.id,
          analysisId,
          stage: DealStage.LEAD,
          notes: `Lead generated automatically from inspection report ${analysisId}. Location: ${address}`,
        },
      });

      return { client, deal };
    });
  }

  async listDeals(userId: string, stage?: DealStage) {
    return this.prisma.deal.findMany({
      where: {
        client: { userId },
        ...(stage ? { stage } : {}),
      },
      include: {
        client: {
          include: { contacts: true },
        },
        estimate: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async moveDealStage(dealId: string, stage: DealStage) {
    const deal = await this.prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');

    return this.prisma.deal.update({
      where: { id: dealId },
      data: { stage },
    });
  }
}
