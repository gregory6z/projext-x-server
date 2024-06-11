/* eslint-disable @typescript-eslint/no-unused-vars */
export interface MonthlyProfitProps {
  month: Date
  profitPercentage: number
}

export class MonthlyProfit {
  constructor(
    public month: Date,
    public profitPercentage: number,
  ) {}

  static *calculate({
    annualProfitPercentage,
    startDate,
    term,
  }: {
    annualProfitPercentage: number
    startDate: Date
    term: number
  }): Generator<
    { monthProfit: MonthlyProfit; totalProfitPercentage: number },
    void,
    unknown
  > {
    const totalMonths = 12 * term
    let totalProfitPercentage = 0

    const VARIATION_PERCENTAGE = 1 // Aumenta a variação para 50%
    let currentYear = startDate.getFullYear()

    // ...
    for (let i = 0; i < totalMonths; i++) {
      const month = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + i,
        1,
      )

      if (month.getFullYear() !== currentYear) {
        currentYear = month.getFullYear()
      }

      const baseProfitPercentage = annualProfitPercentage / 12
      const variation = VARIATION_PERCENTAGE * baseProfitPercentage

      let profitPercentage
      if (i < 3) {
        // Garante que os três primeiros meses sejam sempre positivos
        profitPercentage =
          baseProfitPercentage + Math.abs((Math.random() - 0.5) * 2 * variation)
      } else {
        const remainingMonths = totalMonths - i
        const remainingProfitPercentage =
          annualProfitPercentage - totalProfitPercentage
        const averageRemainingProfitPercentage =
          remainingProfitPercentage / remainingMonths
        // Aumenta a variação para permitir números negativos e subidas mais drásticas
        const negativeVariation = Math.max(
          variation,
          1,
          Math.abs(averageRemainingProfitPercentage - baseProfitPercentage),
        )
        profitPercentage =
          averageRemainingProfitPercentage +
          (Math.random() - 0.5) * 2 * negativeVariation
      }

      // Garante que o lucro não seja mais negativo do que -0.05
      profitPercentage = Math.max(profitPercentage, -0.1)

      const profit = new MonthlyProfit(month, profitPercentage)
      totalProfitPercentage += profitPercentage

      yield { monthProfit: profit, totalProfitPercentage }
    }
    // ...
  }

  static calculateNextMonthProfit({
    annualProfitPercentage,
    startDate,
    term,
    getExistingProfits = () => Promise.resolve([]),
  }: {
    annualProfitPercentage: number
    startDate: Date
    term: number
    getExistingProfits: () => Promise<MonthlyProfit[]>
  }): Promise<{ monthProfit: MonthlyProfit; totalProfitPercentage: number }> {
    return getExistingProfits().then((existingProfits) => {
      const totalExistingProfitPercentage = existingProfits.reduce(
        (total, profit) => total + profit.profitPercentage,
        0,
      )

      const result = this.calculate({
        annualProfitPercentage,
        startDate,
        term,
      }).next().value as {
        monthProfit: MonthlyProfit
        totalProfitPercentage: number
      }

      result.totalProfitPercentage += totalExistingProfitPercentage

      return result
    })
  }
}
