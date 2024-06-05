import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AggregateRoot } from "@/core/entities/aggregate-root"
import dayjs from "dayjs"

export interface InvestmentPurchaseProps {
  accountId: number
  investmentId: number

  paymentType: "normal" | "subscription"

  status: "pending" | "completed" | "failed"

  stripeCustomerId?: string | null
  stripeSubscriptionId?: string | null

  initialAmount: number

  // amountProfits?: AmountProfits[] | null

  // subscriptionPayments: SubscriptionPayment[]

  createdAt?: Date
  updatedAt?: Date | null
}

export class InvestmentPurchase extends AggregateRoot<InvestmentPurchaseProps> {
  get accountId(): number {
    return this.props.accountId
  }

  get investmentId(): number {
    return this.props.investmentId
  }

  get initialAmount(): number {
    return this.props.initialAmount
  }

  get paymentType(): "normal" | "subscription" {
    return this.props.paymentType
  }

  get status(): "pending" | "completed" | "failed" {
    return this.props.status ?? "pending"
  }

  set status(status: "pending" | "completed" | "failed") {
    this.props.status = status
    this.touch()
  }

  get stripeCustomerId(): string | null {
    return this.props.stripeCustomerId ?? null
  }

  get stripeSubscriptionId(): string | null {
    return this.props.stripeSubscriptionId ?? null
  }

  // get amountProfits(): AmountProfits[] | null {
  //   return this.props.amountProfits ?? null
  // }

  get createdAt(): Date {
    return this.props.createdAt ?? new Date()
  }

  get updatedAt(): Date | null {
    return this.props.updatedAt ?? null
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3
  }

  static create(props: InvestmentPurchaseProps, id?: UniqueEntityID) {
    const investmentPurchase = new InvestmentPurchase(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        paymentType: props.paymentType ?? "normal",
        stripeCustomerId: props.stripeCustomerId ?? null,
        stripeSubscriptionId: props.stripeSubscriptionId ?? null,
        status: props.status ?? "pending",
      },
      id,
    )

    return investmentPurchase
  }
}
