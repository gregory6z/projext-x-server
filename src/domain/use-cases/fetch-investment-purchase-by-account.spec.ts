import { InMemoryBankAccountsRepository } from "@/test/repositories/in-memory-bank-accounts-repository"
import { FetchInvestmentPurchaseByAccountIdUseCase } from "./fetch-investment-purchase-by-account"
import { makeInvestmentPurchase } from "@/test/factories/make-investment-purchase"
import { makeBankAccount } from "@/test/factories/make-bank-account"
import { InMemoryInvestmentPurchaseRepository } from "@/test/repositories/in-memory-investment-purshase"

let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository

let sut: FetchInvestmentPurchaseByAccountIdUseCase

describe("Fetch Investment Purchase By Account Id", () => {
  beforeEach(() => {
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()
    inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()

    sut = new FetchInvestmentPurchaseByAccountIdUseCase(
      inMemoryInvestmentPurchaseRepository,
      inMemoryBankAccountsRepository,
    )
  })

  it("should be able to fetch all investment purchases for a given account id", async () => {
    const bankAccount = makeBankAccount()
    const investmentPurchase = makeInvestmentPurchase({
      accountId: bankAccount.id.toString(),
    })

    inMemoryBankAccountsRepository.items.push(bankAccount)
    inMemoryInvestmentPurchaseRepository.items.push(investmentPurchase)

    const result = await sut.execute({ accountId: bankAccount.id.toString() })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      investments: [investmentPurchase],
    })
  })
})
