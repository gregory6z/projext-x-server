import { MonthlyProfit } from "./monthly-profits"

function createProfitsObject(length: number): MonthlyProfit[] {
  const profits: MonthlyProfit[] = []
  for (let i = 0; i < length; i++) {
    const profitPercentage = 12 / (2022 - i)
    const profit = new MonthlyProfit(new Date(2022, i, 1), profitPercentage)
    profits.push(profit)
  }
  return profits
}

// Uso:
const profits = createProfitsObject(2)

test("calculateNextMonthProfit", async () => {
  const result = await MonthlyProfit.calculateNextMonthProfit({
    annualProfitPercentage: 0.5,
    startDate: new Date(2022, 2, 1),
    term: 4,
    getExistingProfits: () => Promise.resolve(profits),
  })

  expect(result).toBeDefined()
  expect(result.monthProfit).toBeInstanceOf(MonthlyProfit)
  expect(result.totalProfitPercentage).toBeGreaterThan(0)
})
