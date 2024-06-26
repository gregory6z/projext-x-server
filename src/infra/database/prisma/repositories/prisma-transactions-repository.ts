import { TransactionsRepository } from "@/domain/repositories/transactions-repository"
import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { Transaction } from "@/domain/entities/transaction"
import { PrismaTransactionsMapper } from "../mappers/prisma-transaction-mapper"

@Injectable()
export class PrismaTransactionsRepository implements TransactionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionsMapper.toPrisma(transaction)

    await this.prisma.transaction.create({
      data,
    })
  }

  async update(transaction: Transaction): Promise<void> {
    const data = PrismaTransactionsMapper.toPrisma(transaction)
    await this.prisma.transaction.update({
      where: {
        id: transaction.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = await this.prisma.transaction.findUnique({
      where: {
        id,
      },
    })

    if (!transaction) {
      return null
    }

    return PrismaTransactionsMapper.toDomain(transaction)
  }

  async findManyByAccountId(accountId: string): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany({
      where: {
        accountId,
      },
    })

    return transactions.map((transaction) =>
      PrismaTransactionsMapper.toDomain(transaction),
    )
  }

  async updateStatus(
    transactionId: string,
    status: "failed" | "completed",
  ): Promise<void> {
    await this.prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status,
      },
    })
  }
}
