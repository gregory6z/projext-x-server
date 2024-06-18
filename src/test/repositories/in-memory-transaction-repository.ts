import { Transaction } from "@/domain/entities/transaction"
import { TransactionsRepository } from "@/domain/repositories/transactions-repository"

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public items: Transaction[] = []
  async create(Transaction: Transaction) {
    this.items.push(Transaction)
  }

  async findById(id: string): Promise<Transaction | null> {
    const transaction = this.items.find(
      (transaction) => transaction.id.toString() === id,
    )
    if (!transaction) {
      return null
    }

    return transaction
  }

  async findManyByAccountId(bankAccountId: string) {
    const transactions = this.items.filter(
      (item) => item.accountId.toString() === bankAccountId,
    )

    return transactions
  }
}
