import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface TransactionProps {
  accountId: string
  type: "deposit" | "withdrawal"

  amount: number
  createdAt?: Date
}

export class Transaction extends AggregateRoot<TransactionProps> {
  get accountId(): string {
    return this.props.accountId
  }

  get type(): string {
    return this.props.type
  }

  get amount(): number {
    return this.props.amount
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: TransactionProps, id?: UniqueEntityID) {
    const transaction = new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return transaction
  }
}
