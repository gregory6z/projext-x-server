import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import dayjs from "dayjs"

export interface InvestmentProps {
  name: string
  description: string
  imageUrl: string

  status: "active" | "completed" | "pending" | "cancelled"

  investmentType: string
  amount: number

  annualProfit: number

  fundraisingProgress: {
    numberOfWeeks: number
    current: number
  }

  monthlyProfits: number[]

  lastMonthlyProfit: number

  term: string

  risk: "low" | "medium" | "high"

  endDate: Date | null

  createdAt: Date
  updatedAt?: Date | null
}

export class Investment extends Entity<InvestmentProps> {
  get name(): string {
    return this.props.name
  }

  get description(): string {
    return this.props.description
  }

  get imageUrl(): string {
    return this.props.imageUrl
  }

  get investmentType(): string {
    return this.props.investmentType
  }

  get fundraisingProgress() {
    return this.props.fundraisingProgress
  }

  set fundraisingProgress(value: { numberOfWeeks: number; current: number }) {
    this.props.fundraisingProgress = value
    this.touch()
  }

  get amount(): number {
    return this.props.amount
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get annualProfit(): number {
    return this.props.annualProfit
  }

  get status(): string {
    return this.props.status
  }

  set status(value: "active" | "completed" | "pending" | "cancelled") {
    this.props.status = value
    this.touch()
  }

  get risk(): string {
    return this.props.risk
  }

  get term(): string {
    return this.props.term
  }

  get endDate(): Date | null {
    return this.props.endDate
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: InvestmentProps, id?: UniqueEntityID) {
    const investment = new Investment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        risk: props.risk ?? "medium",
        status: props.status ?? "pending",
        fundraisingProgress: {
          ...props.fundraisingProgress,
          current: props.fundraisingProgress.current ?? 0,
        },
      },
      id,
    )

    return investment
  }
}
