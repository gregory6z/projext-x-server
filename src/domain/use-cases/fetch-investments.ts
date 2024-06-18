import { Either, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { InvestmentsRepository } from "../repositories/investiments-repository"
import { Investment } from "../entities/investment"

type FetchInvestmentsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    investments: Investment[]
  }
>

export class FetchInvestmentsUseCase {
  constructor(
    private investmentsRepository: InvestmentsRepository,
    // private checkAndActivateInvestmentUseCase: CheckAndActivateInvestmentUseCase,
  ) {}

  async execute(): Promise<FetchInvestmentsUseCaseResponse[]> {
    const investments = await this.investmentsRepository.findAll()

    return investments.map((investment) => {
      investment.setFundraisingProgress()

      // this.checkAndActivateInvestmentUseCase.execute()

      return right({
        investments,
      })
    })
  }
}
