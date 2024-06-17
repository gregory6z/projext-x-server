import { InvestmentPurchase } from "@/domain/entities/investiment-purchase"
import { InvestmentPurchaseRepository } from "@/domain/repositories/investiment-purchase"

export class InMemoryInvestmentPurchaseRepository
  implements InvestmentPurchaseRepository
{
  public items: InvestmentPurchase[] = []

  async create(investmentPurchase: InvestmentPurchase) {
    this.items.push(investmentPurchase)
  }

  async findById(investmentPurchaseId: string) {
    const investmentPurchase = this.items.find(
      (item) => item.id.toString() === investmentPurchaseId,
    )

    if (!investmentPurchase) {
      return null
    }

    return investmentPurchase
  }

  async update(investmentPurchase: InvestmentPurchase) {
    const index = this.items.findIndex(
      (item) => item.id.toString() === investmentPurchase.id.toString(),
    )

    this.items[index] = investmentPurchase
  }

  async findByInvestmentId(investmentId: string) {
    const investmentPurchase = this.items.find(
      (item) => item.investmentId.toString() === investmentId,
    )
    if (!investmentPurchase) {
      return null
    }

    return investmentPurchase
  }

  async findByAccountId(accountId: string) {
    const investmentPurchase = this.items.find(
      (item) => item.accountId === accountId,
    )
    if (!investmentPurchase) {
      return null
    }

    return investmentPurchase
  }

  async findManyByAccountId(accountId: string): Promise<InvestmentPurchase[]> {
    const investmentPurchases = this.items.filter(
      (purchase) => purchase.accountId === accountId,
    )
    return investmentPurchases
  }
}
