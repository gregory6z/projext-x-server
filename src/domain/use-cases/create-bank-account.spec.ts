import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { InMemoryBankAccountsRepository } from "test/repositories/in-memory-bank-accounts-repository"
import { CreateBankAccountUseCase } from "./create-bank-account"
import { makeUser } from "test/factories/make-user"

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
})
