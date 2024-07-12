import { BankAccount } from "../entities/bank-account"

export abstract class BankAccountsRepository {
  abstract create(bankAccount: BankAccount): Promise<void>
  abstract findById(bankAccountId: string): Promise<BankAccount | null>
  abstract update(bankAccount: BankAccount): Promise<void>
  abstract findByUserId(userId: string): Promise<BankAccount | null>
}
