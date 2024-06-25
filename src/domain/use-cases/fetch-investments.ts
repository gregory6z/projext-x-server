import { Either, right } from "@/core/either"
import { InvestmentsRepository } from "../repositories/investiments-repository"
import { Investment } from "../entities/investment"
import { Injectable } from "@nestjs/common"

type FetchInvestmentsUseCaseResponse = Either<
  null,
  {
    investments: Investment[]
  }
>

@Injectable()
export class FetchInvestmentsUseCase {
  constructor(private investmentsRepository: InvestmentsRepository) {}

  async execute(): Promise<FetchInvestmentsUseCaseResponse[]> {
    const investments = await this.investmentsRepository.findAll()

    return investments.map((investment) => {
      investment.setFundraisingProgress()

      return right({
        investments,
      })
    })
  }
}
