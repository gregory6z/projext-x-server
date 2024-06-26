import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { InvestmentPurchase } from "@/domain/entities/investiment-purchase"
import {
  InvestmentPurchase as PrismaInvestmentPurchase,
  Prisma,
} from "@prisma/client"

export class PrismaInvestmentPurchasesMapper {
  static toDomain(raw: PrismaInvestmentPurchase): InvestmentPurchase {
    return InvestmentPurchase.create(
      {
        accountId: raw.accountId,
        investmentId: raw.investmentId,
        paymentType: raw.paymentType,
        status: raw.status,
        stripeCustomerId: raw.stripeCustomerId,
        stripeSubscriptionId: raw.stripeSubscriptionId,
        initialAmount: raw.initialAmount.toNumber(),
        totalAmount: raw.totalAmount.toNumber(),
        amountProfits: raw.amountProfits ? JSON.parse(raw.amountProfits) : [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    investmentPurchase: InvestmentPurchase,
  ): Prisma.InvestmentPurchaseUncheckedCreateInput {
    return {
      id: investmentPurchase.id.toString(),
      accountId: investmentPurchase.accountId,
      investmentId: investmentPurchase.investmentId,
      paymentType: investmentPurchase.paymentType,
      status: investmentPurchase.status,
      stripeCustomerId: investmentPurchase.stripeCustomerId,
      stripeSubscriptionId: investmentPurchase.stripeSubscriptionId,
      initialAmount: investmentPurchase.initialAmount,
      totalAmount: investmentPurchase.totalAmount,
      amountProfits: JSON.stringify(investmentPurchase.amountProfits),
      createdAt: investmentPurchase.createdAt,
      updatedAt: investmentPurchase.updatedAt,
    }
  }
}
