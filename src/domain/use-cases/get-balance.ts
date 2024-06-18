import { Either, right } from "@/core/either"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { TransactionsRepository } from "../repositories/transactions-repository"

interface UpdatedBalanceUseCaseRequest {
  accountId: string
}

type UpdatedBalanceUseCaseResponse = Either<
  null,
  {
    balance: number
  }
>

export class UpdatedBalanceUseCase {
  constructor(
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
    private transactionsRepository: TransactionsRepository,
    // private InvestmentsRepository: InvestmentsRepository,
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

    let balanceValue = investmentPurchases.reduce(
      (total: number, purchase: InvestmentPurchase) =>
        total +
        purchase.initialAmount +
        purchase.amountProfits
          .map((profit) => profit.amount)
          .reduce((total, amount) => total + amount, 0),
      0,
    )

    const transactions =
      await this.transactionsRepository.findManyByAccountId(accountId)

    transactions.forEach((transaction) => {
      if (transaction.type === "deposit") {
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
