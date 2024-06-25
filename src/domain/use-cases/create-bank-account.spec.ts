import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { InMemoryBankAccountsRepository } from "test/repositories/in-memory-bank-accounts-repository"
import { CreateBankAccountUseCase } from "./create-bank-account"
import { makeUser } from "test/factories/make-user"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryBankAccountsRepository: InMemoryBankAccountsRepository

let sut: CreateBankAccountUseCase

describe("Create Bank Account", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryBankAccountsRepository = new InMemoryBankAccountsRepository()

    sut = new CreateBankAccountUseCase(
      inMemoryBankAccountsRepository,
      inMemoryUsersRepository,
    )
  })

  it("should be able to create a new bank account", async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if ("bankAccount" in result.value) {
      expect(result.value.bankAccount.accountNumber).toMatch(/^\d{8}$/)
    }
  })
  it("should return an error if user does not exist", async () => {
    const nonExistentUserId = "non-existent-user-id"

    const result = await sut.execute({
      userId: nonExistentUserId,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
