import { BankAccountsRepository } from "@/domain/repositories/bank-accounts-repository"
import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { BankAccount } from "@/domain/entities/bank-account"
import { PrismaBankAccountsMapper } from "../mappers/prisma-bank-account-mapper"

@Injectable()
export class PrismaBankAccountsRepository implements BankAccountsRepository {
  constructor(private prisma: PrismaService) {}

  async create(bankAccount: BankAccount): Promise<void> {
    const data = PrismaBankAccountsMapper.toPrisma(bankAccount)

    await this.prisma.bankAccount.create({
      data,
    })
  }

  async findByUserId(userId: string): Promise<BankAccount | null> {
    const bankAccount = await this.prisma.bankAccount.findFirst({
      where: {
        userId,
      },
    })

    if (!bankAccount) {
      return null
    }

    return PrismaBankAccountsMapper.toDomain(bankAccount)
  }

  async update(bankAccount: BankAccount): Promise<void> {
    const data = PrismaBankAccountsMapper.toPrisma(bankAccount)
    await this.prisma.bankAccount.update({
      where: {
        id: bankAccount.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<BankAccount | null> {
    const bankAccount = await this.prisma.bankAccount.findUnique({
      where: {
        id,
      },
    })

    if (!bankAccount) {
      return null
    }

    return PrismaBankAccountsMapper.toDomain(bankAccount)
  }
}
