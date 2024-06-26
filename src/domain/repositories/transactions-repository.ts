import { Transaction } from "../entities/transaction"

export abstract class TransactionsRepository {
  abstract create(transaction: Transaction): Promise<void>
  abstract findById(transactionId: string): Promise<Transaction | null>

  abstract findManyByAccountId(accountId: string): Promise<Transaction[]>
  abstract updateStatus(
    transactionId: string,
    status: "failed" | "completed",
  ): Promise<void>
}
