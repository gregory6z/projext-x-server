import { Either, left, right } from "@/core/either"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { Transaction } from "../entities/transaction"
import { TransactionsRepository } from "../repositories/transactions-repository"

interface UpdateTransactionStatusUseCaseRequest {
  transactionId: string
  status: "failed" | "completed"
}

type UpdateTransactionStatusUseCaseResponse = Either<
  WrongCredentialsError,
  {
    transaction: Transaction
  }
>

export class UpdateTransactionStatusUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    transactionId,
    status,
  }: UpdateTransactionStatusUseCaseRequest): Promise<UpdateTransactionStatusUseCaseResponse> {
    const transaction = await this.transactionsRepository.findById(
      transactionId.toString(),
    )

    if (!transaction) {
      return left(new WrongCredentialsError())
    }

    transaction.status = status

    await this.transactionsRepository.updateStatus(status)

    return right({
      transaction,
    })
  }
}
