import { Either, left, right } from "@/core/either"
import { UserAlreadyExistsError } from "./errors/user-already-exists-error"
import { User } from "../entities/user"
import { HashGenerator } from "@/core/cryptography/hash-generator"
import { UsersRepository } from "../repositories/users-repository"

interface CreateUserUseCaseRequest {
  firstName: string
  address: string
  lastName: string
  birthDate: Date
  phone: string
  email: string
  password: string
}

type CreateUserUseCaseResponse = Either<
  UserAlreadyExistsError,
  {
    user: User
  }
>

export class CreateUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    firstName,
    address,
    birthDate,
    lastName,
    phone,
    email,
    password,
  }: CreateUserUseCaseRequest): Promise<CreateUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      email,
      firstName,
      lastName,
      birthDate,
      phone,
      address,
      password: hashedPassword,
      investments: null,
      account: null,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
