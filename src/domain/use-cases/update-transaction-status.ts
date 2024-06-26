import { Either, left, right } from "@/core/either"
import { Transaction } from "../entities/transaction"
import { TransactionsRepository } from "../repositories/transactions-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface UpdateTransactionStatusUseCaseRequest {
  transactionId: string
  status: "failed" | "completed"
}

type UpdateTransactionStatusUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    transaction: Transaction
  }
>

@Injectable()
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
      return left(new ResourceNotFoundError())
    }

    transaction.status = status

    await this.transactionsRepository.updateStatus(transactionId, status)

    return right({
      transaction,
    })
  }
}
