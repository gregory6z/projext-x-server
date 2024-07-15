import { Controller, Get, Param } from "@nestjs/common"
import { FetchInvestmentPurchaseByAccountIdUseCase } from "@/domain/use-cases/fetch-investment-purchase-by-account"
import { InvestmentPurchasePresenter } from "../presenters/investment-purchase.presenter"

@Controller("/investments-purchases")
export class FetchInvestmentPurchaseController {
  constructor(
    private fetchInvestments: FetchInvestmentPurchaseByAccountIdUseCase,
  ) {}

  @Get(":accountId")
  async handle(@Param("accountId") accountId: string) {
    const result = await this.fetchInvestments.execute({
      accountId,
    })

    if (result.isRight()) {
      const investments = result.value.investments

      return {
        investments: investments.map((investment) =>
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          InvestmentPurchasePresenter.toHTTP(investment),
        ),
      }
    }
  }
}
