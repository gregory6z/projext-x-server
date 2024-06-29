import { AggregateRoot } from "@/core/entities/aggregate-root"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface TransactionProps {
  accountId: string
  type: "deposit" | "withdrawal"

  status: "pending" | "completed" | "failed"

  amount: number
  createdAt?: Date
  updatedAt: Date | null
}

export class Transaction extends AggregateRoot<TransactionProps> {
  get status(): "pending" | "completed" | "failed" {
    return this.props.status ?? "pending"
  }

  get accountId(): string {
    return this.props.accountId
  }

  set status(value: "pending" | "completed" | "failed") {
    this.props.status = value
    this.touch()
  }

  get type(): "deposit" | "withdrawal" {
    return this.props.type
  }

  get amount(): number {
    return this.props.amount
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: TransactionProps, id?: UniqueEntityID) {
    const transaction = new Transaction(
      {
        ...props,
        status: props.status ?? "pending",
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return transaction
  }
}
