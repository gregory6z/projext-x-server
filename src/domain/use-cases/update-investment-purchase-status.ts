import { Either, left, right } from "@/core/either"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"

interface UpdateStatusInvestmentPurchaseUseCaseRequest {
  investmentPurchaseId: string
  status: "pending" | "failed" | "completed"
}

type UpdateStatusInvestmentPurchaseUseCaseResponse = Either<
  WrongCredentialsError,
  {
    investmentPurchase: InvestmentPurchase
  }
>

export class UpdateStatusInvestmentPurchaseUseCase {
  constructor(
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
  ) {}

  async execute({
    investmentPurchaseId,
    status,
  }: UpdateStatusInvestmentPurchaseUseCaseRequest): Promise<UpdateStatusInvestmentPurchaseUseCaseResponse> {
    const investmentPurchase = await this.investmentPurchaseRepository.findById(
      investmentPurchaseId.toString(),
    )

    if (!investmentPurchase) {
      return left(new WrongCredentialsError())
    }

    investmentPurchase.status = status

    await this.investmentPurchaseRepository.update(investmentPurchase)

    return right({
      investmentPurchase,
    })
  }
}
