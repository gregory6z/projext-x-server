import { InMemoryInvestmentPurchaseRepository } from "@/test/repositories/in-memory-investment-purshase"
import { makeBankAccount } from "@/test/factories/make-bank-account"
import { InMemoryTransactionsRepository } from "@/test/repositories/in-memory-transaction-repository"
import { makeTransaction } from "@/test/factories/make-transaction"
import { makeInvestmentPurchase } from "@/test/factories/make-investment-purchase"
import { GetBalanceUseCase } from "./get-balance"

let inMemoryInvestmentPurchaseRepository: InMemoryInvestmentPurchaseRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: GetBalanceUseCase

describe("Fetch Balance Use Case", () => {
  beforeEach(() => {
    inMemoryInvestmentPurchaseRepository =
      new InMemoryInvestmentPurchaseRepository()

    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()

    sut = new GetBalanceUseCase(
      inMemoryInvestmentPurchaseRepository,
      inMemoryTransactionsRepository,
    )
  })

  it("should return a balance of 0 if no investment purchases are found", async () => {
    const account = makeBankAccount()

    const result = await sut.execute({
      accountId: account.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.value !== null && "balance" in result.value) {
      const balance = result.value.balance

      expect(balance).toEqual(0)
    }
  })
  it("should correctly calculate the balance based on the transactions", async () => {
    const account = makeBankAccount()

    const investment = makeInvestmentPurchase({
      accountId: account.id.toString(),
      initialAmount: 1000,
    })

    // Crie transações fictícias usando makeTransaction
    const depositTransaction = makeTransaction({
      type: "deposit",
      accountId: account.id.toString(),
      amount: 1000,
    })
    const withdrawalTransaction = makeTransaction({
      type: "withdrawal",
      accountId: account.id.toString(),
      amount: 500,
    })

    inMemoryInvestmentPurchaseRepository.items.push(investment)

    inMemoryTransactionsRepository.items.push(
      depositTransaction,
      withdrawalTransaction,
    )

    const result = await sut.execute({
      accountId: account.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.value !== null && "balance" in result.value) {
      const balance = result.value.balance

      // Verifique se o saldo é calculado corretamente
      expect(balance).toEqual(1500) // 1000 - 500 = 500
    }
  })
})
