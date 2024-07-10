import { InMemoryUsersRepository } from "test/repositories/in-memory-user-repository"
import { GetUserUseCase } from "./get-user"
import { User } from "../entities/user"
import { makeUser } from "test/factories/make-user"

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserUseCase

describe("Get User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new GetUserUseCase(inMemoryUsersRepository)
  })

  it("should be able to retrieve an existing user", async () => {
    const newUser = makeUser({
      firstName: "John",
      lastName: "Doe",
      birthDate: new Date(),
      phone: "123456789",
      email: "johndoe@example.com",
      password: "hashed_password",
      address: "123 Street",
    })

    inMemoryUsersRepository.items.push(newUser)

    const result = await sut.execute({
      userId: newUser.id.toString(),
    })

    console.log(result.value)

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const userProps: User = (
        result.value as unknown as { user: { props: User } }
      ).user.props

      expect(userProps).toEqual(
        expect.objectContaining({
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@example.com",
          phone: "123456789",
          address: "123 Street",
          password: "hashed_password",
        }),
      )

      expect(userProps.birthDate).toBeInstanceOf(Date)
    }
  })

  it("should return an error if the user does not exist", async () => {
    const result = await sut.execute({
      userId: "non_existing_user_id",
    })

    expect(result.isLeft()).toBe(true)
  })
})
