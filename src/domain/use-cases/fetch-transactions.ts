import { Either, right } from "@/core/either"
import { TransactionsRepository } from "../repositories/transactions-repository"
import { Transaction } from "../entities/transaction"
import { Injectable } from "@nestjs/common"

interface FetchTransactionsUseCaseRequest {
  accountId: string
}

type FetchTransactionsUseCaseResponse = Either<
  null,
  {
    transactions: Transaction[]
  }
>

@Injectable()
export class FetchTransactionsUseCase {
  constructor(private transactionsRepository: TransactionsRepository) {}

  async execute({
    accountId,
  }: FetchTransactionsUseCaseRequest): Promise<FetchTransactionsUseCaseResponse> {
    const transactions =
      await this.transactionsRepository.findManyByAccountId(accountId)
    return right({
      transactions,
    })
  }
}
