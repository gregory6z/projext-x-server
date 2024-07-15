import { InvestmentPurchase } from "@/domain/entities/investiment-purchase"
import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { PrismaInvestmentPurchasesMapper } from "../mappers/prisma-investment-purchase"
import { InvestmentPurchaseRepository } from "@/domain/repositories/investiment-purchase"

@Injectable()
export class PrismaInvestmentPurchasesRepository
  implements InvestmentPurchaseRepository
{
  constructor(private prisma: PrismaService) {}

  async create(investmentPurchase: InvestmentPurchase): Promise<void> {
    const data = PrismaInvestmentPurchasesMapper.toPrisma(investmentPurchase)

    await this.prisma.investmentPurchase.create({
      data,
    })
  }

  async update(investmentPurchase: InvestmentPurchase): Promise<void> {
    const data = PrismaInvestmentPurchasesMapper.toPrisma(investmentPurchase)
    await this.prisma.investmentPurchase.update({
      where: {
        id: investmentPurchase.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<InvestmentPurchase | null> {
    const investmentPurchase = await this.prisma.investmentPurchase.findUnique({
      where: {
        id,
      },
    })

    if (!investmentPurchase) {
      return null
    }

    return PrismaInvestmentPurchasesMapper.toDomain(investmentPurchase)
  }

  async findAll(): Promise<InvestmentPurchase[]> {
    const investmentPurchases = await this.prisma.investmentPurchase.findMany()
    return investmentPurchases.map((investmentPurchase) =>
      PrismaInvestmentPurchasesMapper.toDomain(investmentPurchase),
    )
  }

  async findByInvestmentId(
    investmentId: string,
  ): Promise<InvestmentPurchase | null> {
    const investmentPurchase = await this.prisma.investmentPurchase.findFirst({
      where: {
        investmentId,
      },
    })

    if (!investmentPurchase) {
      return null
    }

    return PrismaInvestmentPurchasesMapper.toDomain(investmentPurchase)
  }

  async findByAccountId(accountId: string): Promise<InvestmentPurchase | null> {
    const investmentPurchase = await this.prisma.investmentPurchase.findFirst({
      where: {
        accountId,
      },
    })

    if (!investmentPurchase) {
      return null
    }

    return PrismaInvestmentPurchasesMapper.toDomain(investmentPurchase)
  }

  async findManyByAccountId(accountId: string): Promise<InvestmentPurchase[]> {
    const investmentPurchases = await this.prisma.investmentPurchase.findMany({
      where: {
        accountId,
      },
    })

    return investmentPurchases.map((investmentPurchase) =>
      PrismaInvestmentPurchasesMapper.toDomain(investmentPurchase),
    )
  }
}
