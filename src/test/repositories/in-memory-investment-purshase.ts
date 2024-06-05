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
}
