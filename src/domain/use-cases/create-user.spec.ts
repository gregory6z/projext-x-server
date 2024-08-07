import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { CreateUserUseCase } from "./create-user"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { CreateBankAccountUseCase } from "./create-bank-account"

let inMemoryUsersRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher

let createBankAccountUseCase: CreateBankAccountUseCase

let sut: CreateUserUseCase

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()

    createBankAccountUseCase = vi.fn().mockImplementation(() => {
      return {
        execute: vi.fn().mockResolvedValue({ accountId: "123" }),
      }
    })()

    sut = new CreateUserUseCase(
      inMemoryUsersRepository,
      fakeHasher,
      createBankAccountUseCase,
    )
  })

  it("should be able to create a new user", async () => {
    const result = await sut.execute({
      firstName: "John",
      lastName: "Doe",
      birthDate: new Date(),
      phone: "123456789",
      email: "johndoe@example.com",
      password: "123456",
      address: "123 Street",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUsersRepository.items[0],
    })
  })

  it("should hash user password upon creation", async () => {
    const result = await sut.execute({
      firstName: "John",
      lastName: "Doe",
      birthDate: new Date(),
      phone: "123456789",
      email: "johndoe@example.com",
      password: "123456",
      address: "123 Street",
    })

    const hashedPassword = await fakeHasher.hash("123456")

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })
})
