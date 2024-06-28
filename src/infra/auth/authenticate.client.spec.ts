import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { AuthenticateClientUseCase } from "./authenticate.use-case"
import { makeUser } from "test/factories/make-user"

let inMemoryClientsRepository: InMemoryUsersRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateClientUseCase

describe("Authenticate Client", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateClientUseCase(
      inMemoryClientsRepository,
      fakeHasher,
      encrypter,
    )
  })

  it("should be able to authenticate a client", async () => {
    const client = makeUser({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    })

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
