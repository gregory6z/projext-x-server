import { InMemoryInvestmentRepository } from "@/test/repositories/in-memory-investments-repository"
import { makeInvestment } from "@/test/factories/make-investment"
import { AddMonthlyProfitUseCase } from "./add-monthly-profit"
import sinon from "sinon"
import { InMemoryInvestmentPurchaseRepository } from "@/test/repositories/in-memory-investment-purshase"
import { makeInvestmentPurchase } from "@/test/factories/make-investment-purchase"

describe("AddMonthlyProfitUseCase", () => {
  let sut: AddMonthlyProfitUseCase
  let inMemoryInvestmentsRepository: InMemoryInvestmentRepository
  let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
  let clock: sinon.SinonFakeTimers

  beforeEach(() => {
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()
    sut = new AddMonthlyProfitUseCase(
      inMemoryInvestmentsRepository,
      inMemoryInvestmentPurchaseRepository,
    )

    const initialDate = new Date()
    initialDate.setMonth(initialDate.getMonth() - 6)

    clock = sinon.useFakeTimers(initialDate)
  })
  afterEach(() => {
    clock.restore()
  })

  it("should be able to add monthly profit to an investment", async () => {
    // Set initialDate to one month ago

    const initialDate = new Date()
    initialDate.setMonth(initialDate.getMonth() - 6)

    const investment = makeInvestment({
      status: "active",
      initialDate,
      term: 12,
      annualProfit: 0.15,
      fundraisingProgress: {
        current: 100,
        numberOfWeeks: 0,
      },
    })

    await inMemoryInvestmentsRepository.create(investment)

    for (let i = 0; i < 6; i++) {
      clock.tick(1000 * 60 * 60 * 24 * 30) // Avança o tempo em um mês
      await sut.execute()
    }

    const updatedInvestment = await inMemoryInvestmentsRepository.findById(
      investment.id.toString(),
    )

    // const totalProfit = updatedInvestment!.monthlyProfits.reduce(
    //   (a, b) => a + b.profitPercentage,
    //   0,
    // )

    await inMemoryInvestmentsRepository.findAll()

    expect(updatedInvestment).not.toBeNull()
    expect(updatedInvestment!.monthlyProfits.length).toBe(6)
  })

  it("should be able to add amount profit to an investment purchase", async () => {
    // Set initialDate to one month ago
    const initialDate = new Date()
    initialDate.setMonth(initialDate.getMonth() - 6)

    const investment = makeInvestment({
      status: "active",
      initialDate,
      term: 12,
      annualProfit: 0.19,
      fundraisingProgress: {
        current: 100,
        numberOfWeeks: 0,
      },
    })

    await inMemoryInvestmentsRepository.create(investment)

    // Crie um InvestmentPurchase correspondente ao Investment
    const investmentPurchase = makeInvestmentPurchase({
      investmentId: investment.id.toString(),
      initialAmount: 1000,
      status: "completed",
    })

    await inMemoryInvestmentPurchaseRepository.create(investmentPurchase)

    for (let i = 0; i < 12; i++) {
      clock.tick(1000 * 60 * 60 * 24 * 30) // Avança o tempo em um mês
      await sut.execute()

      // Recupere o InvestmentPurchase do repositório
      const updatedInvestmentPurchase =
        await inMemoryInvestmentPurchaseRepository.findByInvestmentId(
          investment.id.toString(),
        )

      // const finalPercentage = updatedInvestmentPurchase?.amountProfits.reduce(
      //   (total, current) => total + current.profit,
      //   0,
      // )

      // Verifique se o amountProfit foi adicionado corretamente
      expect(updatedInvestmentPurchase?.amountProfits[i]).toBeDefined()
    }
  })
})
