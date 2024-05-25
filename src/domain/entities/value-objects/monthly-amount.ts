export class MonthlyAmount {
  private annualProfit: number
  private initialAmount: number
  private term: number // em anos
  private monthlyAmount: number[]

  constructor(annualProfit: number, initialAmount: number, term: number) {
    this.annualProfit = annualProfit
    this.initialAmount = initialAmount
    this.term = term

    this.monthlyAmount = this.calculateMonthlyAmount()
  }

  private calculateMonthlyAmount(): number[] {
    const monthlyAmount: number[] = []
    let currentAmount = this.initialAmount

    for (let i = 0; i < 12 * this.term; i++) {
      currentAmount += this.annualProfit / 12
      monthlyAmount.push(currentAmount)
    }

    return monthlyAmount
  }

  get initialInvestment(): number {
    return this.initialAmount
  }

  getMonthlyAmount(): number[] {
    return this.monthlyAmount
  }
}
