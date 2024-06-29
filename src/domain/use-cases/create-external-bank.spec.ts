import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { CreateExternalBankUseCase } from "./create-external-bank"
import { InMemoryExternalBankRepository } from "test/repositories/in-memory-bank-external-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryExternalBanksRepository: InMemoryExternalBankRepository

let sut: CreateExternalBankUseCase

describe("Create external bank account", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryExternalBanksRepository = new InMemoryExternalBankRepository()

    sut = new CreateExternalBankUseCase(
      inMemoryExternalBanksRepository,
      inMemoryUsersRepository,
    )
  })

  it("should be able to create a new external bank account", async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      accountHolderName: "John Doe",
      bic: "123456",
      iban: "123456",
    })

    expect(result.isRight()).toBe(true)
    if ("externalBank" in result.value) {
      expect(result.value.externalBank.accountHolderName).toEqual("John Doe")
    }
  })
  it("should return an error if user does not exist", async () => {
    const nonExistentUserId = "non-existent-user-id" // Um ID que você sabe que não existe no repositório

    const result = await sut.execute({
      userId: nonExistentUserId,
      accountHolderName: "John Doe",
      bic: "123456",
      iban: "123456",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
