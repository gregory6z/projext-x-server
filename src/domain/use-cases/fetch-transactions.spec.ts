import { makeBankAccount } from "@/test/factories/make-bank-account"
import { makeTransaction } from "@/test/factories/make-transaction"
import { InMemoryTransactionsRepository } from "@/test/repositories/in-memory-transaction-repository"
import { FetchTransactionsUseCase } from "./fetch-transactions"

let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: FetchTransactionsUseCase

describe("FetchTransactionUseCase", () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new FetchTransactionsUseCase(inMemoryTransactionsRepository)
  })

  it("should return all transactions for a given account", async () => {
    const account = makeBankAccount()

    const firstTransaction = makeTransaction({
      accountId: account.id.toString(),
      type: "deposit",
      amount: 1000,
    })
    const SecondTransaction = makeTransaction({
      accountId: account.id.toString(),
      type: "deposit",
      amount: 1000,
    })

    inMemoryTransactionsRepository.items.push(
      firstTransaction,
      SecondTransaction,
    )

    const result = await sut.execute({
      accountId: account.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.transactions).toEqual([
        firstTransaction,
        SecondTransaction,
      ])
    }
  })

  it("should return an empty array if there are no transactions for a given account", async () => {
    const accountId = "1"

    const result = await sut.execute({ accountId })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.transactions).toEqual([])
    }
  })
})
