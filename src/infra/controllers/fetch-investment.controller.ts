import { Public } from "@/infra/auth/public"

import { FetchInvestmentsUseCase } from "@/domain/use-cases/fetch-investments"
import { Controller, Get } from "@nestjs/common"
import { InvestmentPresenter } from "../presenters/investment.presenter"

@Controller("/investments")
@Public()
export class FetchInvestmentController {
  constructor(private fetchInvestments: FetchInvestmentsUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchInvestments.execute()

    if (result[0].isRight()) {
      const investments = result[0].value.investments

      return { investments: investments.map(InvestmentPresenter.toHTTP) }
    }
  }
}
