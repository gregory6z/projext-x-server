import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { BankAccount } from "@/domain/entities/bank-account"
import { BankAccount as PrismaBankAccount, Prisma } from "@prisma/client"

export class PrismaBankAccountsMapper {
  static toDomain(raw: PrismaBankAccount): BankAccount {
    return BankAccount.create(
      {
        userId: raw.userId,
        accountNumber: raw.accountNumber,
        balance: raw.balance.toNumber(),
        availableWithdrawal: raw.availableWithdrawal.toNumber(), // dinheiro disponível para saque
        createdAt: raw.createdAt,
        // updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    bankAccount: BankAccount,
  ): Prisma.BankAccountUncheckedCreateInput {
    return {
      id: bankAccount.id.toString(),
      userId: bankAccount.userId,
      accountNumber: bankAccount.accountNumber,
      balance: bankAccount.balance,
      availableWithdrawal: bankAccount.availableWithdrawal, // dinheiro disponível para saque
      createdAt: bankAccount.createdAt,
      updatedAt: bankAccount.updatedAt,
    }
  }
}
