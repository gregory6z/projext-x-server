import { InMemoryBankAccountsRepository } from "test/repositories/in-memory-bank-accounts-repository"
import { CreateTransactionUseCase } from "./create-transaction"
import { InMemoryTransactionsRepository } from "test/repositories/in-memory-transaction-repository"
import { makeBankAccount } from "test/factories/make-bank-account"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { InsufficientBalanceError } from "./errors/insufficient-balance-error"

let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository

let sut: CreateTransactionUseCase

describe("Create Transaction", () => {
  beforeEach(() => {
    inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()

    sut = new CreateTransactionUseCase(
      inMemoryTransactionsRepository,
      inMemoryBankAccountsRepository,
    )
  })

  it("should be able to create a new transaction", async () => {
    const account = makeBankAccount({
      balance: 0,
    })
    inMemoryBankAccountsRepository.items.push(account)

    const result = await sut.execute({
      accountId: account.id.toString(),
      type: "deposit",
      amount: 100,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      transaction: inMemoryTransactionsRepository.items[0],
    })
  })

  it("should return an error if the account does not exist", async () => {
    const result = await sut.execute({
      accountId: "non-existing-account-id",
      type: "deposit",
      amount: 100,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
  it("should return an error if the withdrawal amount is greater than the available balance", async () => {
    const account = makeBankAccount({
      availableWithdrawal: 500,
      // outras propriedades da conta
    })
    inMemoryBankAccountsRepository.items.push(account)

    const result = await sut.execute({
      accountId: account.id.toString(),
      type: "withdrawal",
      amount: 1000,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InsufficientBalanceError)
  })
  it("should be able to create a withdrawal transaction", async () => {
    const account = makeBankAccount({
      availableWithdrawal: 1000,
      // outras propriedades da conta
    })
    inMemoryBankAccountsRepository.items.push(account)

    const result = await sut.execute({
      accountId: account.id.toString(),
      type: "withdrawal",
      amount: 500,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      transaction: inMemoryTransactionsRepository.items[0],
    })
  })
})
