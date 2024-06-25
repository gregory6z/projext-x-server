import { InvestmentPurchaseRepository } from "@/domain/repositories/investiment-purchase"
import { CronJob } from "cron"
import { InvestmentList } from "../entities/investmentsList"
import { InvestmentsRepository } from "../repositories/investiments-repository"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"
import { Injectable, NotFoundException } from "@nestjs/common"

@Injectable()
export class CheckAndActivateInvestmentUseCase {
  constructor(
    private investmentsRepository: InvestmentsRepository,
    private InvestmentPurchaseRepository: InvestmentPurchaseRepository,
    private BankAccount: BankAccountsRepository,
  ) {}

  async execute(): Promise<void> {
    const investments = await this.investmentsRepository.findAll()
    const investmentList = new InvestmentList(investments)

    const currentDate = new Date()

    for (const investment of investmentList.getItems()) {
      if (
        investment.fundraisingProgress.current === 100 &&
        investment.status === "pending"
      ) {
        const now = new Date()
        const endDate = now.setFullYear(now.getFullYear() + investment.term)

        investment.status = "active"
        investment.initialDate = now
        investment.endDate = new Date(endDate)

        await this.investmentsRepository.update(investment)
      }
      if (
        investment.status === "active" &&
        investment.endDate &&
        currentDate > investment.endDate
      ) {
        investment.status = "completed"

        const investmentPurchase =
          await this.InvestmentPurchaseRepository.findByInvestmentId(
            investment.id.toString(),
          )

        if (!investmentPurchase) {
          throw new NotFoundException("Investment purchase not found")
        }

        const bankAccount = await this.BankAccount.findById(
          investmentPurchase.accountId,
        )

        if (!bankAccount) {
          throw new NotFoundException("Bank account not found")
        }

        bankAccount.availableWithdrawal += investmentPurchase.totalAmount

        await this.BankAccount.update(bankAccount)
        await this.investmentsRepository.update(investment)
      }
    }
  }

  schedule(): void {
    const job = new CronJob("0 0 * * *", async () => {
      await this.execute()
    })

    job.start()
  }
}
