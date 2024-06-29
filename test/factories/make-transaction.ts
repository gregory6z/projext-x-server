import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Transaction, TransactionProps } from "@/domain/entities/transaction"
import { PrismaTransactionsMapper } from "@/infra/database/prisma/mappers/prisma-transaction-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { fakerFR } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
) {
  const transaction = Transaction.create(
    {
      amount: 100,
      type: "deposit",

      accountId: fakerFR.string.uuid(),
      status: "pending",
      ...override,
    },
    id,
  )

  return transaction
}

@Injectable()
export class TransactionFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTransaction(
    data: Partial<TransactionProps> = {},
  ): Promise<Transaction> {
    const transaction = makeTransaction(data)

    await this.prisma.transaction.create({
      data: PrismaTransactionsMapper.toPrisma(transaction),
    })

    return transaction
  }
}
