import { InMemoryInvestmentRepository } from "@/test/repositories/in-memory-investments-repository"
import { makeInvestment } from "@/test/factories/make-investment"
import { AddMonthlyProfitUseCase } from "./add-monthly-profit"

describe("AddMonthlyProfitUseCase", () => {
  let sut: AddMonthlyProfitUseCase
  let inMemoryInvestmentsRepository: InMemoryInvestmentRepository

  beforeEach(() => {
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()
    sut = new AddMonthlyProfitUseCase(inMemoryInvestmentsRepository)
  })

  it("should be able to add monthly profit to an investment", async () => {
    const initialDate = new Date()
    // Set initialDate to one month ago

    const investment = makeInvestment({
      status: "active",
      initialDate,
      term: 12,
      annualProfit: 2,
      fundraisingProgress: {
        current: 100,
        numberOfWeeks: 0,
      },
    })
    await inMemoryInvestmentsRepository.create(investment)

    const updatedInvestment = await inMemoryInvestmentsRepository.findById(
      investment.id.toString(),
    )

    await sut.execute()

    await inMemoryInvestmentsRepository.findAll()

    console.log(updatedInvestment?.monthlyProfits)

    expect(updatedInvestment).not.toBeNull()
    expect(updatedInvestment!.monthlyProfits.length).toBeGreaterThan(0) // Use non-null assertion operator
  })
})
