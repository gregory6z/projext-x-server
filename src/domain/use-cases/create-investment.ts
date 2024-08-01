import { Either, right } from "@/core/either"
import { Investment } from "../entities/investment"
import { InvestmentsRepository } from "../repositories/investiments-repository"
import { Injectable } from "@nestjs/common"

interface CreateInvestmentUseCaseRequest {
  name: string
  description: string
  imageUrl: string

  investmentType: string

  annualProfit: number

  fundraisingProgress: {
    current: number
    numberOfWeeks: number
  }

  term: number
  risk: string
}

type CreateInvestmentUseCaseResponse = Either<
  null,
  {
    investment: Investment
  }
>

@Injectable()
export class CreateInvestmentUseCase {
  constructor(private investmentRepository: InvestmentsRepository) {}

  async execute({
    name,
    description,
    imageUrl,
    investmentType,
    annualProfit,
    fundraisingProgress,
    term,
    risk,
  }: CreateInvestmentUseCaseRequest): Promise<CreateInvestmentUseCaseResponse> {
    const investment = Investment.create({
      name,
      description,
      imageUrl,
      investmentType,
      annualProfit,
      fundraisingProgress,
      term,
      risk,
      status: "pending",
      monthlyProfits: [],
      createdAt: new Date(),
    })

    await this.investmentRepository.create(investment)

    return right({
      investment,
    })
  }
}
