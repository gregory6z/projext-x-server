import { Investment } from "@/domain/entities/investment"
import { InvestmentsRepository } from "@/domain/repositories/investiments-repository"

export class InMemoryInvestmentRepository implements InvestmentsRepository {
  public items: Investment[] = []

  async create(investment: Investment) {
    this.items.push(investment)
  }

  async findById(investmentId: string) {
    const investment = this.items.find(
      (item) => item.id.toString() === investmentId,
    )

    if (!investment) {
      return null
    }

    return investment
  }

  async findAll() {
    return this.items
  }

  async update(investment: Investment): Promise<void> {
    const investmentIndex = this.items.findIndex(
      (item) => item.id === investment.id,
    )

    if (investmentIndex === -1) {
      return
    }

    this.items[investmentIndex] = investment
  }
}
