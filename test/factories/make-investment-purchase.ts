import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  InvestmentPurchase,
  InvestmentPurchaseProps,
} from "@/domain/entities/investiment-purchase"
import { PrismaInvestmentPurchasesMapper } from "@/infra/database/prisma/mappers/prisma-investment-purchase"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { fakerFR } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeInvestmentPurchase(
  override: Partial<InvestmentPurchaseProps> = {},
  id?: UniqueEntityID,
) {
  const investmentPurchase = InvestmentPurchase.create(
    {
      accountId: fakerFR.string.uuid(),

      investmentId: fakerFR.string.uuid(),
      initialAmount: 100,
      status: "pending",
      paymentType: "normal",
      ...override,
    },
    id,
  )

  return investmentPurchase
}

@Injectable()
export class InvestmentPurchaseFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaInvestmentPurchase(
    data: Partial<InvestmentPurchaseProps> = {},
  ): Promise<InvestmentPurchase> {
    const investmentPurchase = makeInvestmentPurchase(data)

    await this.prisma.investmentPurchase.create({
      data: PrismaInvestmentPurchasesMapper.toPrisma(investmentPurchase),
    })

    return investmentPurchase
  }
}
