import { Either, right } from "@/core/either"
import { BadRequestException, Injectable } from "@nestjs/common"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"

interface CreateInvestmentPurchaseUseCaseRequest {
  accountId: string
  investmentId: string
  paymentType: string

  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null

  initialAmount: number
}

type CreateInvestmentPurchaseUseCaseResponse = Either<
  BadRequestException,
  {
    investmentPurchase: InvestmentPurchase
  }
>

@Injectable()
export class CreateInvestmentPurchaseUseCase {
  constructor(
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
  ) {}

  async execute({
    accountId,
    investmentId,

    initialAmount,
  }: CreateInvestmentPurchaseUseCaseRequest): Promise<CreateInvestmentPurchaseUseCaseResponse> {
    const investmentPurchase = InvestmentPurchase.create({
      accountId,
      investmentId,
      paymentType: "normal",
      status: "pending",

      initialAmount,
    })

    await this.investmentPurchaseRepository.create(investmentPurchase)

    return right({
      investmentPurchase,
    })
  }
}
