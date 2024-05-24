import { InMemoryUsersRepository } from "@/test/repositories/in-memory-user-repository"
import { makeUser } from "@/test/factories/make-user"
import { InMemoryExternalBankRepository } from "@/test/repositories/in-memory-bank-external-repository"
import { DeleteExternalBankUseCase } from "./delete-external-bank"
import { makeExternalBank } from "@/test/factories/make-external-bank"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryExternalBanksRepository: InMemoryExternalBankRepository

let sut: DeleteExternalBankUseCase

describe("Delete external bank account", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryExternalBanksRepository = new InMemoryExternalBankRepository()

    sut = new DeleteExternalBankUseCase(inMemoryExternalBanksRepository)
  })

  it("should be able to delete a external bank account", async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const firstExternalBank = makeExternalBank({
      userId: user.id.toString(),
    })

    await inMemoryExternalBanksRepository.create(firstExternalBank)

    const result = await sut.execute({
      userId: user.id.toString(),
      externalBankId: firstExternalBank.id.toString(),
    })

    console.log(result)

    expect(result.isRight()).toBe(true)
    const deletedBank = await inMemoryUsersRepository.findById(
      firstExternalBank.id.toString(),
    )
    expect(deletedBank).toBeNull()
  })

  it("should throw an error if the external bank account does not exist", async () => {
    const user = makeUser()

    await inMemoryUsersRepository.create(user)

    const nonExistentBankId = "non-existent-id"

    try {
      await sut.execute({
        userId: user.id.toString(),
        externalBankId: nonExistentBankId,
      })
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError)
    }
  })
  it("should not allow a user to delete another user's external bank account", async () => {
    const user1 = makeUser()
    const user2 = makeUser()

    await inMemoryUsersRepository.create(user1)
    await inMemoryUsersRepository.create(user2)

    const externalBank = makeExternalBank({
      userId: user1.id.toString(),
    })

    try {
      await sut.execute({
        userId: user2.id.toString(),
        externalBankId: externalBank.id.toString(),
      })
    } catch (error) {
      expect(error).toBeInstanceOf(NotAllowedError)
    }
  })
})
