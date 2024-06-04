import { InMemoryInvestmentRepository } from "@/test/repositories/in-memory-investments-repository"
import { FetchInvestmentsUseCase } from "./fetch-investments"
import { CheckAndActivateInvestmentUseCase } from "./check-and-activate-investment"
import { makeInvestment } from "@/test/factories/make-investment"

let inMemoryInvestmentsRepository: InMemoryInvestmentRepository
let checkAndActivateInvestmentUseCase: CheckAndActivateInvestmentUseCase

let sut: FetchInvestmentsUseCase

describe("Fetch Investments", () => {
  beforeEach(() => {
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()
    checkAndActivateInvestmentUseCase = new CheckAndActivateInvestmentUseCase(
      inMemoryInvestmentsRepository,
    )

    sut = new FetchInvestmentsUseCase(
      inMemoryInvestmentsRepository,
      checkAndActivateInvestmentUseCase,
    )
  })

  it("should be able to fetch all investments", async () => {
    const investment = makeInvestment()

    inMemoryInvestmentsRepository.items.push(investment)

    const result = await sut.execute()

    expect(result.every((r) => r.isRight())).toBe(true)
    const values = result.map((r) => r.value)

    expect(values).toEqual([
      {
        investments: [investment],
      },
    ])
  })

  it("should activate investments that have reached 100% fundraising progress", async () => {
    const investment = makeInvestment({
      fundraisingProgress: {
        current: 100,
        numberOfWeeks: 0,
      },
    })
    inMemoryInvestmentsRepository.items.push(investment)

    await sut.execute()

    expect(investment.status).toEqual("active")
  })
})
