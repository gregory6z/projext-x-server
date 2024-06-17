import { InvestmentsRepository } from "@/domain/repositories/investiments-repository"
import { Either, left, right } from "@/core/either"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"

interface UpdatedBalanceUseCaseRequest {
  accountId: string
}

type UpdatedBalanceUseCaseResponse = Either<
  WrongCredentialsError,
  {
    investmentPurchase: InvestmentPurchase
  }
>

export class UpdatedBalanceUseCase {
  constructor(
    private bankAccount: BankAccountsRepository,
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
    // private InvestmentsRepository: InvestmentsRepository,
  ) {}

  async execute({
    accountId,
  }: UpdatedBalanceUseCaseRequest): Promise<UpdatedBalanceUseCaseResponse> {
    const account = await this.bankAccount.findById(accountId)

    return right({
      investmentPurchase,
    })
  }
}
