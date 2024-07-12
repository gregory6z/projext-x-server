import { BadRequestException } from "@nestjs/common"

import { User } from "../entities/user"
import { BankAccount } from "../entities/bank-account"
import { Transaction } from "../entities/transaction"
import { GetUserUseCase } from "./get-user"
import { InMemoryTransactionsRepository } from "test/repositories/in-memory-transaction-repository"
import { InMemoryBankAccountsRepository } from "test/repositories/in-memory-bank-accounts-repository"
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { makeBankAccount } from "test/factories/make-bank-account"
import { makeTransaction } from "test/factories/make-transaction"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: GetUserUseCase

describe("Get User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()

    sut = new GetUserUseCase(
      inMemoryUsersRepository,
      inMemoryBankAccountsRepository,
      inMemoryTransactionsRepository,
    )
  })

  it("should be able to retrieve an existing user along with their bank account and transactions", async () => {
    // Create a new user and add it to the repository
    const newUser: User = makeUser({
      firstName: "John",
      lastName: "Doe",
      birthDate: new Date(),
    })
    inMemoryUsersRepository.items.push(newUser)

    const newBankAccount: BankAccount = makeBankAccount({
      userId: newUser.id.toString(),
      balance: 1000,
    })
    inMemoryBankAccountsRepository.items.push(newBankAccount)

    // Create a new transaction for the user's bank account and add it to the repository
    const newTransaction: Transaction = makeTransaction({
      accountId: newBankAccount.id.toString(),
      amount: 100,
      type: "deposit",
      createdAt: new Date(),
    })

    inMemoryTransactionsRepository.items.push(newTransaction)

    // Execute the use case
    const result = await sut.execute({ userId: newUser.id.toString() })

    console.log(result)

    // Assert the result is right and contains the user, their bank account, and transactions
    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user).toEqual(newUser)
      expect(result.value.bankAccount).toEqual(newBankAccount)
      expect(result.value.transactions).toEqual([newTransaction])
    }
  })

  it("should return a BadRequestException if the user does not exist", async () => {
    const result = await sut.execute({ userId: "non-existing-user-id" })
    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(BadRequestException)
    }
  })
})
