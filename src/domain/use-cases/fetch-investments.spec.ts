import { InMemoryInvestmentRepository } from "@/test/repositories/in-memory-investments-repository"
import { FetchInvestmentsUseCase } from "./fetch-investments"
import { makeInvestment } from "@/test/factories/make-investment"

let inMemoryInvestmentsRepository: InMemoryInvestmentRepository

let sut: FetchInvestmentsUseCase

describe("Fetch Investments", () => {
  beforeEach(() => {
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()

    sut = new FetchInvestmentsUseCase(inMemoryInvestmentsRepository)
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
})
