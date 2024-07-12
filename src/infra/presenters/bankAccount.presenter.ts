import { BankAccount } from "@prisma/client"

export class BankAccountPresenter {
  static toHTTP(bank: BankAccount) {
    return {
      id: bank.id.toString() as string,
      userId: bank.userId,
      accountNumber: bank.accountNumber,
      balance: Number(bank.balance),
      availableWithdrawal: Number(bank.availableWithdrawal),
      createdAt: bank.createdAt,
      updatedAt: bank.updatedAt,
    }
  }
}
