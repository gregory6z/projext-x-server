import { WatchedList } from "@/core/entities/watched-list"
import { Transaction } from "./transaction"

export class TransactionList extends WatchedList<Transaction> {
  compareItems(a: Transaction, b: Transaction): boolean {
    return a.id.equals(b.id)
  }
}
