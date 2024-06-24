import { InMemoryInvestmentPurchaseRepository } from "test/repositories/in-memory-investment-purshase"
import { makeInvestment } from "test/factories/make-investment"
import { CheckAndActivateInvestmentUseCase } from "./check-and-activate-investment"
import { InMemoryInvestmentRepository } from "test/repositories/in-memory-investments-repository"
import { InMemoryBankAccountsRepository } from "test/repositories/in-memory-bank-accounts-repository"
import { makeInvestmentPurchase } from "test/factories/make-investment-purchase"
import { makeBankAccount } from "test/factories/make-bank-account"

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

  it("should complete an investment when the end date is passed", async () => {
    const investment = makeInvestment({
      status: "active",
      term: 1, // Definindo o termo para 1 ano atrás para garantir que a data de término seja ultrapassada
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    })

    const bankAccount = makeBankAccount({
      availableWithdrawal: 1000,
    })

    const investmentPurchase = makeInvestmentPurchase({
      investmentId: investment.id.toString(),
      accountId: bankAccount.id.toString(),
      initialAmount: 100,
      totalAmount: 1000,
    })

    inMemoryBankAccountsRepository.items.push(bankAccount)
    inMemoryInvestmentsRepository.items.push(investment)
    inMemoryInvestmentPurchaseRepository.items.push(investmentPurchase)

    await sut.execute()

    const updatedInvestment = await inMemoryInvestmentsRepository.findById(
      investment.id.toString(),
    )
    const updatedBankAccount = await inMemoryBankAccountsRepository.findById(
      bankAccount.id.toString(),
    )

    expect(updatedInvestment?.status).toBe("completed")
    expect(updatedBankAccount?.availableWithdrawal).toBe(1100)
  })

  it("should throw an error if the bank account is not found", async () => {
    const investment = makeInvestment({
      status: "active",
      term: 1, // Definindo o termo para 1 ano atrás para garantir que a data de término seja ultrapassada
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    })

    const investmentPurchase = makeInvestmentPurchase({
      investmentId: investment.id.toString(),
      accountId: "non-existing-account-id",
      totalAmount: 1000,
    })

    inMemoryInvestmentsRepository.items.push(investment)
    inMemoryInvestmentPurchaseRepository.items.push(investmentPurchase)

    await expect(sut.execute()).rejects.toThrow("Bank account not found")
  })
})
