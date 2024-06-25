import { Either, left, right } from "@/core/either"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"
import { InvestmentsRepository } from "../repositories/investiments-repository"
import { AccountNumber } from "../entities/value-objects/account-number"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface RegisterInvestmentPurchaseUseCaseRequest {
  accountId: string
  investmentId: string
  paymentType: "normal" | "subscription"
  initialAmount: number
}

type RegisterInvestmentPurchaseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    investmentPurchase: InvestmentPurchase
  }
>

@Injectable()
export class RegisterInvestmentPurchaseUseCase {
  constructor(
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
    private bankAccountRepository: BankAccountsRepository,
    private investmentRepository: InvestmentsRepository,
  ) {}

  async execute({
    accountId,
    investmentId,
    paymentType,
    initialAmount,
  }: RegisterInvestmentPurchaseUseCaseRequest): Promise<RegisterInvestmentPurchaseUseCaseResponse> {
    const bankAccount = await this.bankAccountRepository.findById(
      AccountNumber.toString(),
    )

    if (bankAccount) {
      return left(new ResourceNotFoundError())
    }

    const investment = await this.investmentRepository.findById(
      investmentId.toString(),
    )

    if (!investment) {
      return left(new ResourceNotFoundError())
    }

    const investmentPurchase = InvestmentPurchase.create({
      accountId,
      investmentId,
      paymentType,
      initialAmount,
      status: "pending",
    })

    await this.investmentPurchaseRepository.create(investmentPurchase)

    return right({
      investmentPurchase,
    })
  }
}
