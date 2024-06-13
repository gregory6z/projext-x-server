import { InMemoryInvestmentPurchaseRepository } from "@/test/repositories/in-memory-investment-purshase"
import { makeInvestment } from "@/test/factories/make-investment"
import { CheckAndActivateInvestmentUseCase } from "./check-and-activate-investment"
import { InMemoryInvestmentRepository } from "@/test/repositories/in-memory-investments-repository"
import { InMemoryBankAccountsRepository } from "@/test/repositories/in-memory-bank-accounts-repository"

describe("Check and Activate Investment Use Case", () => {
  let inMemoryInvestmentsRepository: InMemoryInvestmentRepository
  let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
  let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository
  let sut: CheckAndActivateInvestmentUseCase

  beforeEach(() => {
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()
    inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()

    sut = new CheckAndActivateInvestmentUseCase(
      inMemoryInvestmentsRepository,
      inMemoryInvestmentPurchaseRepository,
      inMemoryBankAccountsRepository,
    )
  })

  it("should activate an investment when fundraising progress is 100", async () => {
    const investment = makeInvestment({
      fundraisingProgress: {
        current: 100,
        numberOfWeeks: 0,
      },
    })

    inMemoryInvestmentsRepository.items.push(investment)

    await sut.execute()

    const updatedInvestment = await inMemoryInvestmentsRepository.findById(
      investment.id.toString(),
    )

    expect(updatedInvestment?.status).toBe("active")
  })
})
