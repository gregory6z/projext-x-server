import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Investment, InvestmentProps } from "@/domain/entities/investment"
import { PrismaInvestmentsMapper } from "@/infra/database/prisma/mappers/prisma-investment.mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { fakerFR } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeInvestment(
  override: Partial<InvestmentProps> = {},
  id?: UniqueEntityID,
) {
  const investment = Investment.create(
    {
      name: fakerFR.lorem.words(2),
      description: fakerFR.lorem.words(10),
      imageUrl: fakerFR.image.url(),

      status: "pending",
      investmentType: fakerFR.lorem.word(),
      annualProfit: 10,
      fundraisingProgress: {
        current: 1,
        numberOfWeeks: 2,
      },
      monthlyProfits: [],
      term: 1,
      risk: "low",
      initialDate: new Date(),
      endDate: null,
      createdAt: new Date(),
      updatedAt: null,
      ...override,
    },
    id,
  )

  return investment
}

@Injectable()
export class InvestmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaInvestment(
    data: Partial<InvestmentProps> = {},
  ): Promise<Investment> {
    const investment = makeInvestment(data)

    await this.prisma.investment.create({
      data: PrismaInvestmentsMapper.toPrisma(investment),
    })

    return investment
  }
}
