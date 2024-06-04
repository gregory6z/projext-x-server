import { CronJob } from "cron"
import { MonthlyProfit } from "../entities/value-objects/monthly-profits"
import { InvestmentsRepository } from "../repositories/investiments-repository"

export class AddMonthlyProfitUseCase {
  constructor(private investmentsRepository: InvestmentsRepository) {}

  async execute(): Promise<void> {
    const investments = await this.investmentsRepository.findAll()

    for (const investment of investments) {
      if (investment.initialDate) {
        const { monthProfit } = await MonthlyProfit.calculateNextMonthProfit({
          annualProfitPercentage: investment.annualProfit,
          startDate: investment.initialDate,
          term: investment.term,
          getExistingProfits: () =>
            this.investmentsRepository.getMonthlyProfits(
              investment.id.toString(),
            ),
        })

        await investment.addMonthlyProfit(monthProfit)

        // Salve o investimento atualizado no repositório
        await this.investmentsRepository.update(investment)
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
