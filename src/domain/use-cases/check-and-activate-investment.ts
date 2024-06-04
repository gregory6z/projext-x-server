import { InvestmentList } from "../entities/investmentsList"
import { InvestmentsRepository } from "../repositories/investiments-repository"

export class CheckAndActivateInvestmentUseCase {
  constructor(private investmentsRepository: InvestmentsRepository) {}

  async execute(): Promise<void> {
    const investments = await this.investmentsRepository.findAll()
    const investmentList = new InvestmentList(investments)

    for (const investment of investmentList.getItems()) {
      if (
        investment.fundraisingProgress.current === 100 &&
        investment.status !== "active"
      ) {
        const now = new Date()
        const endDate = now.setFullYear(now.getFullYear() + investment.term)

        investment.status = "active"
        investment.initialDate = now
        investment.endDate = new Date(endDate)

        await this.investmentsRepository.update(investment)
      }
    }
  }
}
