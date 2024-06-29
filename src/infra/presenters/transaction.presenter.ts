import { Transaction } from "@prisma/client"

export class TransactionPresenter {
  static toHTTP(transaction: Transaction) {
    return {
      id: transaction.id.toString(),
      accountId: transaction.accountId,

      type: transaction.type,
      status: transaction.status,

      amount: transaction.amount,

      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
    }
  }
}
