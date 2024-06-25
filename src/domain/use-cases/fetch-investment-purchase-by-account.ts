import { Either, left, right } from "@/core/either"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"
import { Injectable, NotFoundException } from "@nestjs/common"

interface FetchInvestmentPurchaseByAccountIdUseCaseRequest {
  accountId: string
}

type FetchInvestmentPurchaseByAccountIdUseCaseResponse = Either<
  NotFoundException,
  {
    investments: InvestmentPurchase[]
  }
>

@Injectable()
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
      return left(new NotFoundException())
    }

    const investmentPurchases =
      (await this.investmentPurchaseRepository.findManyByAccountId(
        BankAccount.id.toString(),
      )) || []

    return right({
      investments: investmentPurchases,
    })
  }
}
