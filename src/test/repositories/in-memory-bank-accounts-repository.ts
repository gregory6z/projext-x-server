import { BankAccount } from "@/domain/entities/bank-account"
import { BankAccountsRepository } from "@/domain/repositories/bank-accounts-repository"
export class InMemoryBankAccountsRepository implements BankAccountsRepository {
  public items: BankAccount[] = []

  async create(bankAccount: BankAccount) {
    this.items.push(bankAccount)
  }
}
