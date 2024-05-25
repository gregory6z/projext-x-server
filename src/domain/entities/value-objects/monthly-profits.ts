export class MonthlyProfits {
  private annualProfit: number
  private monthlyProfits: number[]
  private monthlyAmount: number[]

  constructor(annualProfit: number, monthlyAmount: number[]) {
    this.annualProfit = annualProfit
    this.monthlyAmount = monthlyAmount

    this.monthlyProfits = this.calculateMonthlyProfits()
  }

  private calculateMonthlyProfits(): number[] {
    const profits: number[] = []
    const baseMonthlyProfit = this.annualProfit / 12
    let currentAmount = 0

    for (let i = 0; i < 4; i++) {
      const variation = Math.random() * 0.05
      const monthlyProfit = baseMonthlyProfit + baseMonthlyProfit * variation
      currentAmount += this.monthlyAmount[i]
      profits.push(monthlyProfit + currentAmount)
    }

    for (let i = 4; i < 11; i++) {
      const variation = (Math.random() - 0.5) * 0.1
      const monthlyProfit = baseMonthlyProfit + baseMonthlyProfit * variation
      currentAmount += this.monthlyAmount[i]
      profits.push(monthlyProfit + currentAmount)
    }

    // Calcula o lucro do último mês para garantir que a soma total seja igual ao lucro anual
    const totalProfit = profits.reduce((a, b) => a + b, 0) - currentAmount
    profits[11] = this.annualProfit - totalProfit + currentAmount

    return profits
  }

  // Getter para retornar todos os lucros mensais
  get allMonthlyProfits(): number[] {
    return this.monthlyProfits
  }
}
