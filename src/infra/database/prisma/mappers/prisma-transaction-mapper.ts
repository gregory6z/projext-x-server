import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Transaction } from "@/domain/entities/transaction"
import { Transaction as PrismaTransaction, Prisma } from "@prisma/client"

export class PrismaTransactionsMapper {
  static toDomain(raw: PrismaTransaction): Transaction {
    return Transaction.create(
      {
        accountId: raw.accountId,
        type: raw.type,

        status: raw.status,

        amount: raw.amount.toNumber(),
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    transaction: Transaction,
  ): Prisma.TransactionUncheckedCreateInput {
    return {
      id: transaction.id.toString(),
      accountId: transaction.accountId,
      type: transaction.type,
      status: transaction.status,

      amount: transaction.amount,
      createdAt: transaction.createdAt,
    }
  }
}
