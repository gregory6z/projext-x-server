import { InMemoryInvestmentRepository } from "test/repositories/in-memory-investments-repository"
import { CreateInvestmentUseCase } from "./create-investment"
import { makeInvestment } from "test/factories/make-investment"

let inMemoryInvestmentsRepository: InMemoryInvestmentRepository
let sut: CreateInvestmentUseCase

describe("Create Investment", () => {
  beforeEach(() => {
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()

    sut = new CreateInvestmentUseCase(inMemoryInvestmentsRepository)
  })

  it("should be able to create an investment", async () => {
    const investmentData = makeInvestment({
      name: "Investment Test",
      description: "This is a test investment",
      imageUrl: "http://test.com/image.jpg",
      investmentType: "type1",
      annualProfit: 10,
      fundraisingProgress: {
        current: 1000,
        numberOfWeeks: 4,
      },
      term: 12,
      risk: "low",
    })

    const result = await sut.execute(investmentData)

    expect(result.isRight()).toBe(true)

    if (result.value !== null && "investment" in result.value) {
      const createdInvestment = result.value.investment

      expect(createdInvestment.name).toEqual(investmentData.name)
      expect(createdInvestment.description).toEqual(investmentData.description)
      expect(createdInvestment.imageUrl).toEqual(investmentData.imageUrl)
      expect(createdInvestment.investmentType).toEqual(
        investmentData.investmentType,
      )
      expect(createdInvestment.annualProfit).toEqual(
        investmentData.annualProfit,
      )
      expect(createdInvestment.fundraisingProgress).toEqual(
        investmentData.fundraisingProgress,
      )
      expect(createdInvestment.term).toEqual(investmentData.term)
      expect(createdInvestment.risk).toEqual(investmentData.risk)
      expect(createdInvestment.status).toEqual("pending")
    }

    // outros testes conforme necessário...
  })
})
