import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { Investment } from "@/domain/entities/investment"
import { InvestmentsRepository } from "@/domain/repositories/investiments-repository"
import { PrismaInvestmentsMapper } from "../mappers/prisma-investment.mapper"
import { MonthlyProfit } from "@/domain/entities/value-objects/monthly-profits"

@Injectable()
export class PrismaInvestmentsRepository implements InvestmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(investment: Investment): Promise<void> {
    const data = PrismaInvestmentsMapper.toPrisma(investment)

    await this.prisma.investment.create({
      data,
    })
  }

  async update(investment: Investment): Promise<void> {
    const data = PrismaInvestmentsMapper.toPrisma(investment)
    await this.prisma.investment.update({
      where: {
        id: investment.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<Investment | null> {
    const investment = await this.prisma.investment.findUnique({
      where: {
        id,
      },
    })

    if (!investment) {
      return null
    }

    return PrismaInvestmentsMapper.toDomain(investment)
  }

  async findAll(): Promise<Investment[]> {
    const investments = await this.prisma.investment.findMany()
    return investments.map((investment) =>
      PrismaInvestmentsMapper.toDomain(investment),
    )
  }

  async getMonthlyProfits(investmentId: string): Promise<MonthlyProfit[]> {
    const investmentWithProfits = await this.prisma.investment.findUnique({
      where: {
        id: investmentId,
      },
    })

    if (!investmentWithProfits) {
      return []
    }
    const investmentProfit = PrismaInvestmentsMapper.toDomain(
      investmentWithProfits,
    )
    return investmentProfit.monthlyProfits
  }
}
