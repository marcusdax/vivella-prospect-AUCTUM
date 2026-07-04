// backend/src/estimates/estimates.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstimateStatus } from '@prisma/client';

@Injectable()
export class EstimatesService {
  constructor(private readonly prisma: PrismaService) {}

  async createForDeal(dealId: string) {
    return this.prisma.estimate.create({
      data: {
        dealId,
        status: EstimateStatus.DRAFT,
      },
    });
  }

  async addLineItem(
    categoryId: string,
    item: {
      code?: string;
      description: string;
      quantity: number;
      unit: string;
      unitCost: number;
    }
  ) {
    const totalCost = Math.round(item.quantity * item.unitCost);
    
    return this.prisma.$transaction(async (tx) => {
      const lineItem = await tx.lineItem.create({
        data: {
          categoryId,
          code: item.code,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unitCost: item.unitCost,
          totalCost,
        },
      });

      await this.recalculateTotal(tx, categoryId);
      return lineItem;
    });
  }

  private async recalculateTotal(tx: any, categoryId: string) {
    const category = await tx.estimateCategory.findUnique({
      where: { id: categoryId },
      include: {
        estimate: {
          include: {
            categories: {
              include: { lineItems: true },
            },
          },
        },
      },
    });

    if (!category) throw new NotFoundException('Estimate category not found');

    // Aggregate cost across all categories
    const newTotal = category.estimate.categories.reduce((acc, cat) => {
      const catSum = cat.lineItems.reduce((sum, item) => sum + item.totalCost, 0);
      return acc + catSum;
    }, 0);

    await tx.estimate.update({
      where: { id: category.estimateId },
      data: { totalCost: newTotal },
    });
  }

  async exportXml(estimateId: string): Promise<string> {
    const estimate = await this.prisma.estimate.findUnique({
      where: { id: estimateId },
      include: {
        categories: {
          include: { lineItems: true },
        },
      },
    });

    if (!estimate) throw new NotFoundException('Estimate not found');

    let itemXml = '';
    for (const cat of estimate.categories) {
      for (const item of cat.lineItems) {
        itemXml += `
    <LineItem>
      <Category>${this.escapeXml(cat.name)}</Category>
      <Code>${this.escapeXml(item.code || '')}</Code>
      <Description>${this.escapeXml(item.description)}</Description>
      <Quantity>${item.quantity}</Quantity>
      <Unit>${item.unit}</Unit>
      <UnitCost>${(item.unitCost / 100).toFixed(2)}</UnitCost>
      <TotalCost>${(item.totalCost / 100).toFixed(2)}</TotalCost>
    </LineItem>`;
      }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<AtlasEstimate id="${estimate.id}" totalCost="${(estimate.totalCost / 100).toFixed(2)}">
  <LineItems>${itemXml}
  </LineItems>
</AtlasEstimate>`;
  }

  private escapeXml(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
