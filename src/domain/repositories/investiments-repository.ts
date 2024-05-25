import { Investment } from "../entities/investment"

export abstract class InvestmentsRepository {
  abstract create(investment: Investment): Promise<void>
  abstract findById(investmentId: string): Promise<Investment | null>
  abstract update(investment: Investment): Promise<void>
}
