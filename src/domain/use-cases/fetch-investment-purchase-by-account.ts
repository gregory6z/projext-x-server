import { Either, left, right } from "@/core/either"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"

interface FetchInvestmentPurchaseByAccountIdUseCaseRequest {
  accountId: string
}

type FetchInvestmentPurchaseByAccountIdUseCaseResponse = Either<
  null,
  {
    investments: InvestmentPurchase[]
  }
>

export class FetchInvestmentPurchaseByAccountIdUseCase {
  constructor(
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
    private bankAccountRepository: BankAccountsRepository,
  ) {}

  async execute({
    accountId,
  }: FetchInvestmentPurchaseByAccountIdUseCaseRequest): Promise<FetchInvestmentPurchaseByAccountIdUseCaseResponse> {
    const BankAccount = await this.bankAccountRepository.findById(
      accountId.toString(),
    )

    if (!BankAccount) {
      return left(null)
    }

    const investmentPurchases =
      (await this.investmentPurchaseRepository.findManyByAccountId(
        BankAccount.accountNumber,
      )) || []

    console.log(investmentPurchases)

    return right({
      investments: investmentPurchases,
    })
  }
}
