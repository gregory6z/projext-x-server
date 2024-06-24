import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { makeUser } from "test/factories/make-user"
import { CreateExternalBankUseCase } from "./create-external-bank"
import { InMemoryExternalBankRepository } from "test/repositories/in-memory-bank-external-repository"

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
      accountNumber: "12345678",
    })

    expect(result.isRight()).toBe(true)
    if ("externalBank" in result.value) {
      expect(result.value.externalBank.accountHolderName).toEqual("John Doe")
    }
  })
})
