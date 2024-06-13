import { BankAccount } from "@/domain/entities/bank-account"
import { BankAccountsRepository } from "@/domain/repositories/bank-accounts-repository"
export class InMemoryBankAccountsRepository implements BankAccountsRepository {
  public items: BankAccount[] = []

  async create(bankAccount: BankAccount) {
    this.items.push(bankAccount)
  }

  async findById(bankAccountId: string) {
    const bankAccount = this.items.find(
      (item) => item.accountNumber === bankAccountId,
    )

    if (!bankAccount) {
      return null
    }

    return bankAccount
  }

  async update(bankAccount: BankAccount): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === bankAccount.id.toString(),
    )

    this.items[index] = bankAccount
  }
}
