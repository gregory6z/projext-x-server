import { BankAccountsRepository } from "@/domain/repositories/bank-accounts-repository"
import { Either, left, right } from "@/core/either"
import { TransactionsRepository } from "../repositories/transactions-repository"
import { Transaction } from "../entities/transaction"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { InsufficientBalanceError } from "./errors/insufficient-balance-error"
import { Injectable } from "@nestjs/common"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

interface CreateTransactionUseCaseRequest {
  accountId: string
  type: "deposit" | "withdrawal"

  amount: number
}

type CreateTransactionUseCaseResponse = Either<
  WrongCredentialsError | InsufficientBalanceError,
  {
    transaction: Transaction
  }
>

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionsRepository,
    private bankAccountsRepository: BankAccountsRepository,
  ) {}

  async execute({
    accountId,
    type,
    amount,
  }: CreateTransactionUseCaseRequest): Promise<CreateTransactionUseCaseResponse> {
    const account = await this.bankAccountsRepository.findById(accountId)

    if (!account) {
      return left(new ResourceNotFoundError())
    }

    if (type === "withdrawal" && account?.availableWithdrawal < amount) {
      return left(new InsufficientBalanceError())
    }

    const transaction = Transaction.create({
      accountId,
      type,
      amount,
      status: "pending",
      updatedAt: new Date(),
    })

    await this.transactionRepository.create(transaction)

    return right({
      transaction,
    })
  }
}
