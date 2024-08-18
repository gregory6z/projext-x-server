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

    // const VARIATION_PERCENTAGE = 1 // Aumenta a variação para 50%
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
      // const variation = VARIATION_PERCENTAGE * baseProfitPercentage

      let profitPercentage
      if (i < 3) {
        // Garante que os três primeiros meses sejam sempre positivos
        profitPercentage =
          baseProfitPercentage * (1 + (Math.random() - 0.5) * 2 * 0.2) // Aumenta a variação para 2%
      } else {
        const remainingMonths = totalMonths - i
        const remainingProfitPercentage =
          annualProfitPercentage - totalProfitPercentage
        const averageRemainingProfitPercentage =
          remainingProfitPercentage / remainingMonths
        // Ajusta a variação para permitir números negativos e subidas mais drásticas
        const negativeVariation = Math.min(
          Math.max(
            0.02, // Aumenta a variação para 2%
            Math.abs(averageRemainingProfitPercentage - baseProfitPercentage),
          ),
          0.02, // Limita a variação a 2%
        )
        profitPercentage =
          averageRemainingProfitPercentage *
          (1 + (Math.random() - 0.5) * 2 * negativeVariation)
      }
      // Garante que o lucro não seja mais negativo do que -0.02
      profitPercentage = Math.max(profitPercentage, -0.02)

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
