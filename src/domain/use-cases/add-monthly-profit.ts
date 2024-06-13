import { CronJob } from "cron"
import { MonthlyProfit } from "../entities/value-objects/monthly-profits"
import { InvestmentsRepository } from "../repositories/investiments-repository"
import { InvestmentPurchaseRepository } from "../repositories/investiment-purchase"

export class AddMonthlyProfitUseCase {
  constructor(
    private investmentsRepository: InvestmentsRepository,
    private investmentPurchaseRepository: InvestmentPurchaseRepository,
  ) {}

  async execute(): Promise<void> {
    const investments = await this.investmentsRepository.findAll()

    for (const investment of investments) {
      try {
        if (investment.status === "active") {
          const { monthProfit } = await MonthlyProfit.calculateNextMonthProfit({
            annualProfitPercentage: investment.annualProfit,
            startDate: investment.initialDate ?? new Date(),
            term: investment.term,
            getExistingProfits: () =>
              this.investmentsRepository.getMonthlyProfits(
                investment.id.toString(),
              ),
          })

          await investment.addMonthlyProfit(monthProfit)

          await this.investmentsRepository.update(investment)

          const investmentPurchase =
            await this.investmentPurchaseRepository.findByInvestmentId(
              investment.id.toString(),
            )

          if (investmentPurchase?.status === "completed") {
            const amountMonth = {
              month: monthProfit.month,
              amount:
                monthProfit.profitPercentage * investmentPurchase.initialAmount,
              profit: monthProfit.profitPercentage,
            }
            investmentPurchase.amountProfits.push(amountMonth)

            this.investmentPurchaseRepository.update(investmentPurchase)
          }
        }
      } catch (error) {
        console.error(
          `Erro ao adicionar lucro mensal ao investimento ${investment.id}:`,
          error,
        )
      }
    }
  }

  schedule(): void {
    // Cria um novo trabalho cron que será executado no primeiro dia de cada mês
    const job = new CronJob("0 0 1 * *", async () => {
      await this.execute()
    })

    // Inicia o trabalho cron
    job.start()
  }
}
