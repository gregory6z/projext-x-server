import { InMemoryInvestmentPurchaseRepository } from "test/repositories/in-memory-investment-purshase"
import { UpdateStatusInvestmentPurchaseUseCase } from "./update-investment-purchase-status"
import { makeInvestmentPurchase } from "test/factories/make-investment-purchase"

let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
let sut: UpdateStatusInvestmentPurchaseUseCase

describe("Update Status Investment Purchase", () => {
  beforeEach(() => {
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()

    sut = new UpdateStatusInvestmentPurchaseUseCase(
      inMemoryInvestmentPurchaseRepository,
    )
  })

  it("should be able to update an investment purchase status", async () => {
    const investmentPurchase = makeInvestmentPurchase()

    inMemoryInvestmentPurchaseRepository.items.push(investmentPurchase)

    const result = await sut.execute({
      investmentPurchaseId: investmentPurchase.id.toString(),
      status: "completed",
    })

    expect(result.isRight()).toBe(true)

    if ("investmentPurchase" in result.value) {
      const updatedInvestmentPurchase = result.value.investmentPurchase

      expect(updatedInvestmentPurchase.id).toEqual(investmentPurchase.id)
      expect(updatedInvestmentPurchase.status).toEqual("completed")
    }

    // outros testes conforme necessário...
  })
})
