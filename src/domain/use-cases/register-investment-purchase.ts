import { Either, left, right } from "@/core/either"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"
import { InvestmentsRepository } from "../repositories/investiments-repository"

interface RegisterInvestmentPurchaseUseCaseRequest {
  accountId: number
  investmentId: number
  paymentType: "normal" | "subscription"
  initialAmount: number
}

type RegisterInvestmentPurchaseUseCaseResponse = Either<
  WrongCredentialsError,
  {
    investmentPurchase: InvestmentPurchase
  }
>

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
      accountId.toString(),
    )

    if (bankAccount) {
      return left(new WrongCredentialsError())
    }

    const investment = await this.investmentRepository.findById(
      investmentId.toString(),
    )

    if (!investment) {
      return left(new WrongCredentialsError())
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