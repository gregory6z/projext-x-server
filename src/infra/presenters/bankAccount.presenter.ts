import { BankAccount } from "@prisma/client"

export class InvestmentPresenter {
  static toHTTP(bank: BankAccount) {
    return {
      id: bank.id.toString(),
      userId: bank.userId,
      accountNumber: bank.accountNumber,
      balance: bank.balance,
      availableWithdrawal: bank.availableWithdrawal,
      createdAt: bank.createdAt,
      updatedAt: bank.updatedAt,
    }
  }
}
