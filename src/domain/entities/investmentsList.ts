import { WatchedList } from "@/core/entities/watched-list"
import { Investment } from "./investment"

export class InvestmentList extends WatchedList<Investment> {
  compareItems(a: Investment, b: Investment): boolean {
    return a.id.equals(b.id)
  }
}
