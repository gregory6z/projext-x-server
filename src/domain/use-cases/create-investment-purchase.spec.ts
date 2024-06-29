import { InMemoryInvestmentPurchaseRepository } from "test/repositories/in-memory-investment-purshase"
import { CreateInvestmentPurchaseUseCase } from "./create-investment-purchase"

let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
let sut: CreateInvestmentPurchaseUseCase

describe("Create Investment Purchase", () => {
  beforeEach(() => {
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()

    sut = new CreateInvestmentPurchaseUseCase(
      inMemoryInvestmentPurchaseRepository,
    )
  })

  it("should be able to create an investment purchase", async () => {
    const investmentPurchaseData = {
      accountId: "account1",
      investmentId: "investment1",
      paymentType: "normal", // Note: This field is not used in the use case's execute method parameters
      initialAmount: 1000,
    }

    const result = await sut.execute(investmentPurchaseData)

    expect(result.isRight()).toBe(true)

    if (result.value !== null && "investmentPurchase" in result.value) {
      const createdInvestmentPurchase = result.value.investmentPurchase

      expect(createdInvestmentPurchase.accountId).toEqual(
        investmentPurchaseData.accountId,
      )
      expect(createdInvestmentPurchase.investmentId).toEqual(
        investmentPurchaseData.investmentId,
      )
      expect(createdInvestmentPurchase.paymentType).toEqual("normal") // Since it's hardcoded in the use case
      expect(createdInvestmentPurchase.status).toEqual("pending") // Since it's hardcoded in the use case
      expect(createdInvestmentPurchase.initialAmount).toEqual(
        investmentPurchaseData.initialAmount,
      )
    }

    // outros testes conforme necessário...
  })
})
