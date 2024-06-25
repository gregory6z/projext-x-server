import { Either, left, right } from "@/core/either"
import { InvestmentPurchase } from "../entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { Injectable } from "@nestjs/common"

interface UpdateStatusInvestmentPurchaseUseCaseRequest {
  investmentPurchaseId: string
  status: "pending" | "failed" | "completed"
}

type UpdateStatusInvestmentPurchaseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    investmentPurchase: InvestmentPurchase
  }
>

@Injectable()
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
      return left(new ResourceNotFoundError())
    }

    investmentPurchase.status = status

    await this.investmentPurchaseRepository.update(investmentPurchase)

    return right({
      investmentPurchase,
    })
  }
}
