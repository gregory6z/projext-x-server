import { Either, right } from "@/core/either"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { InvestmentPurchase } from "../entities/investiment-purchase"

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

    const balanceValue = investmentPurchases.reduce(
      (total: number, purchase: InvestmentPurchase) =>
        total +
        purchase.initialAmount +
        purchase.amountProfits
          .map((profit) => profit.amount)
          .reduce((total, amount) => total + amount, 0),
      0,
    )

    return right({
      balance: balanceValue,
    })
  }
}
