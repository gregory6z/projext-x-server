import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Investment } from "@/domain/entities/investment"
import { Investment as PrismaInvestment, Prisma } from "@prisma/client"

export class PrismaInvestmentsMapper {
  static toDomain(raw: PrismaInvestment): Investment {
    return Investment.create(
      {
        name: raw.name,
        description: raw.description,
        imageUrl: raw.imageUrl,
        status: raw.status,
        investmentType: raw.investmentType,
        annualProfit: raw.annualProfit.toNumber(),
        fundraisingProgress: JSON.parse(raw.fundraisingProgress),
        monthlyProfits: JSON.parse(raw.monthlyProfits),
        term: raw.term,

        risk: raw.risk,

        initialDate: raw.initialDate,
        endDate: raw.endDate,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    investment: Investment,
  ): Prisma.InvestmentUncheckedCreateInput {
    return {
      id: investment.id.toString(),
      name: investment.name,
      description: investment.description,
      imageUrl: investment.imageUrl,
      status: investment.status,
      investmentType: investment.investmentType,
      annualProfit: investment.annualProfit,
      fundraisingProgress: JSON.stringify(investment.fundraisingProgress),
      monthlyProfits: JSON.stringify(investment.monthlyProfits),
      term: investment.term,

      risk: investment.risk,

      initialDate: investment.initialDate,
      endDate: investment.endDate,

      createdAt: investment.createdAt,
      updatedAt: investment.updatedAt,
    }
  }
}
