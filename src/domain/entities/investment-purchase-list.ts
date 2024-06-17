import { WatchedList } from "@/core/entities/watched-list"
import { InvestmentPurchase } from "./investiment-purchase"

export class InvestmentPurchaseList extends WatchedList<InvestmentPurchase> {
  compareItems(a: InvestmentPurchase, b: InvestmentPurchase): boolean {
    return a.accountId === b.accountId
  }
}
