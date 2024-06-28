import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { makeUser } from "test/factories/make-user"
import { EditUserUseCase } from "./edit-user"
import { NotFoundException } from "@nestjs/common"
let inMemoryUsersRepository: InMemoryUsersRepository

let fakeEncrypter: FakeEncrypter
let fakeHasher: FakeHasher

let sut: EditUserUseCase

describe("Edit User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new EditUserUseCase(
      inMemoryUsersRepository,
      fakeEncrypter,
      fakeHasher,
    )
  })

  it("should be able to edit a user", async () => {
    const user = makeUser({
      address: "123 Street",
      phone: "123456789",
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      address: "321 Street",
      phone: "987654321",
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].address).toEqual("321 Street")
  })

  it("should hash client password upon editing", async () => {
    const user = makeUser({
      password: "123456",
    })

    inMemoryUsersRepository.items.push(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      password: "654321",
    })

    const hashedPassword = await fakeHasher.hash("654321")

    expect(result.isRight()).toBe(true)
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword)
  })
  it("should return an error when the user is not found", async () => {
    const nonExistentUserId = "some-non-existent-id"

    const result = await sut.execute({
      userId: nonExistentUserId,
      phone: "987654321",
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotFoundException)
  })
})
