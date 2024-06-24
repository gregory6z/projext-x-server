import { InMemoryBankAccountsRepository } from "test/repositories/in-memory-bank-accounts-repository"
import { RegisterInvestmentPurchaseUseCase } from "./register-investment-purchase"
import { makeInvestment } from "test/factories/make-investment"
import { InMemoryInvestmentPurchaseRepository } from "test/repositories/in-memory-investment-purshase"
import { InMemoryInvestmentRepository } from "test/repositories/in-memory-investments-repository"
import { makeBankAccount } from "test/factories/make-bank-account"

let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository
let inMemoryInvestmentsRepository: InMemoryInvestmentRepository

let sut: RegisterInvestmentPurchaseUseCase

describe("Register Investment Purchase", () => {
  beforeEach(() => {
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()
    inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()
    inMemoryInvestmentsRepository = new InMemoryInvestmentRepository()

    sut = new RegisterInvestmentPurchaseUseCase(
      inMemoryInvestmentPurchaseRepository,
      inMemoryBankAccountsRepository,
      inMemoryInvestmentsRepository,
    )
  })

  it("should be able to register an investment purchase", async () => {
    const investment = makeInvestment()
    const account = makeBankAccount()

    inMemoryInvestmentsRepository.items.push(investment)
    inMemoryBankAccountsRepository.items.push(account)

    const result = await sut.execute({
      accountId: account.accountNumber.toString(),
      investmentId: investment.id.toString(),
      paymentType: "normal",
      initialAmount: 1000,
    })

    expect(result.isRight()).toBe(true)

    if ("investmentPurchase" in result.value) {
      const investmentPurchase = result.value.investmentPurchase

      expect(investmentPurchase.accountId).toEqual(account.accountNumber)
      expect(investmentPurchase.investmentId.toString()).toEqual(
        investment.id.toString(),
      )
      expect(investmentPurchase.paymentType).toEqual("normal")
      expect(investmentPurchase.initialAmount).toEqual(1000)
      expect(investmentPurchase.status).toEqual("pending")
    }

    // outros testes conforme necessário...
  })
})
