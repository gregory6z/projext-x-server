import { InvestmentPurchase } from "../entities/investiment-purchase"

export abstract class InvestmentPurchaseRepository {
  abstract create(investment: InvestmentPurchase): Promise<void>
  abstract findById(
    InvestmentPurchaseId: string,
  ): Promise<InvestmentPurchase | null>

  abstract findByInvestmentId(
    investmentId: string,
  ): Promise<InvestmentPurchase | null>

  abstract findByAccountId(
    AccountId: string,
  ): Promise<InvestmentPurchase | null>

  abstract findManyByAccountId(
    accountId: string,
  ): Promise<InvestmentPurchase[] | null>

  abstract update(investment: InvestmentPurchase): Promise<void>
}
