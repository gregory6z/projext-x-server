import { InMemoryInvestmentPurchaseRepository } from "test/repositories/in-memory-investment-purshase"
import { UpdateStatusInvestmentPurchaseUseCase } from "./update-investment-purchase-status"
import { makeInvestmentPurchase } from "test/factories/make-investment-purchase"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

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
  it("should return an error when the investment purchase is not found", async () => {
    // Não adicione nenhum investimento ao repositório

    const response = await sut.execute({
      investmentPurchaseId: "nonExistingId",
      status: "completed",
    })

    expect(response.isLeft()).toBe(true)
    expect(response.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
