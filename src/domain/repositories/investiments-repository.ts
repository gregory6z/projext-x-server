import { Investment } from "../entities/investment"
import { MonthlyProfit } from "../entities/value-objects/monthly-profits"

export abstract class InvestmentsRepository {
  abstract create(investment: Investment): Promise<void>
  abstract findById(investmentId: string): Promise<Investment | null>
  abstract update(investment: Investment): Promise<void>
  abstract findAll(): Promise<Investment[]>
  abstract getMonthlyProfits(investmentId: string): Promise<MonthlyProfit[]>
}
