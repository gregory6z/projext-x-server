import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import dayjs from "dayjs"
import { FundraisingProgress } from "./value-objects/fundraising-progress"
import { MonthlyProfit } from "./value-objects/monthly-profits"

export interface InvestmentProps {
  name: string
  description: string
  imageUrl: string

  status: "active" | "completed" | "pending" | "cancelled"

  investmentType: string

  annualProfit: number

  fundraisingProgress: {
    current: number
    numberOfWeeks: number
  }

  monthlyProfits: MonthlyProfit[]

  term: number

  risk: "low" | "medium" | "high"

  initialDate?: Date | null
  endDate?: Date | null

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

  setFundraisingProgress() {
    this.props.fundraisingProgress.current = FundraisingProgress.create(
      this.createdAt,
      this.fundraisingProgress.numberOfWeeks,
    ).calculate()

    this.touch()
  }

  checkAndActivate() {
    if (
      this.props.fundraisingProgress.current === 100 &&
      this.props.status === "pending"
    ) {
      const now = new Date()
      const endDate = dayjs(now).add(this.props.term, "year").toDate()

      this.props.status = "active"
      this.props.initialDate = now
      this.props.endDate = endDate
    }
  }

  get current() {
    return this.props.fundraisingProgress.current
  }

  set current(value: number) {
    this.props.fundraisingProgress.current = value
    this.touch()
  }

  get numberOfWeeks() {
    return this.props.fundraisingProgress.numberOfWeeks
  }

  set numberOfWeeks(value: number) {
    this.props.fundraisingProgress.numberOfWeeks = value
    this.touch()
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

  get term(): number {
    return this.props.term
  }

  get risk(): string {
    return this.props.risk
  }

  get endDate(): Date | null {
    return this.props.endDate ?? null
  }

  get initialDate(): Date | null {
    return this.props.endDate ?? null
  }

  set initialDate(value: Date | null) {
    this.props.endDate = value
    this.touch()
  }

  set endDate(value: Date | null) {
    this.props.endDate = value
    this.touch()
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get monthlyProfits(): MonthlyProfit[] {
    return this.props.monthlyProfits
  }

  async addMonthlyProfit(profit: MonthlyProfit): Promise<void> {
    this.props.monthlyProfits.push(profit)
    this.touch()
  }

  // set monthlyProfits(value: { date: Date; profitPercentage: number }[]) {
  //   if (!this.props.startDate) {
  //     return
  //   }

  //   const result = await MonthlyProfit.calculateNextMonthProfit({
  //     annualProfitPercentage: this.props.annualProfit,
  //     startDate: this.props.startDate,
  //     term: this.props.term,
  //     getExistingProfits: () => Promise.resolve([]),
  //   })

  //   this.props.monthlyProfits = result.monthProfit

  //   this.touch()
  // }

  static create(props: InvestmentProps, id?: UniqueEntityID) {
    const investment = new Investment(
      {
        ...props,

        risk: props.risk ?? "medium",
        status: props.status ?? "pending",
        fundraisingProgress: {
          ...(props.fundraisingProgress ?? 2),
          current: props.fundraisingProgress.current ?? 0,
        },
        monthlyProfits: props.monthlyProfits ?? [],
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return investment
  }
}
