import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface TransactionProps {
  transactionId: number
  accountId: number
  type: string
  amount: number
  timestamp: Date
}

export class Transaction extends AggregateRoot<TransactionProps> {
  get transactionId(): number {
    return this.props.transactionId
  }

  get accountId(): number {
    return this.props.accountId
  }

  get type(): string {
    return this.props.type
  }

  get amount(): number {
    return this.props.amount
  }

  get timestamp(): Date {
    return this.props.timestamp
  }

  static create(props: TransactionProps, id?: UniqueEntityID) {
    const transaction = new Transaction(props, id)

    return transaction
  }
}
