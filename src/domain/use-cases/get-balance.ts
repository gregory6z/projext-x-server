import { Either, right } from "@/core/either"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { TransactionsRepository } from "../repositories/transactions-repository"
import { Injectable } from "@nestjs/common"

interface UpdatedBalanceUseCaseRequest {
  accountId: string
}

type UpdatedBalanceUseCaseResponse = Either<
  null,
  {
    balance: number
  }
>

@Injectable()
export class GetBalanceUseCase {
  constructor(
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
    private transactionsRepository: TransactionsRepository,
  ) {}

  async execute({
    accountId,
  }: UpdatedBalanceUseCaseRequest): Promise<UpdatedBalanceUseCaseResponse> {
    const investmentPurchases =
      await this.investmentPurchaseRepository.findManyByAccountId(accountId)

    if (!investmentPurchases) {
      return right({
        balance: 0,
      })
    }

    let balanceValue = investmentPurchases
      .map((purchase) => purchase.totalAmount)
      .reduce((a, b) => a + b, 0)

    const transactions =
      await this.transactionsRepository.findManyByAccountId(accountId)

    transactions.forEach((transaction) => {
      if (
        transaction.type === "deposit" &&
        transaction.status === "completed"
      ) {
        balanceValue += transaction.amount
      } else if (transaction.type === "withdrawal") {
        balanceValue -= transaction.amount
      }
    })

    return right({
      balance: balanceValue,
    })
  }
}
