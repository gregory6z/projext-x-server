import { Encrypter } from "@/core/cryptography/encrypter"
import { HashComparer } from "@/core/cryptography/hash-comparer"
import { Either, left, right } from "@/core/either"
import { UsersRepository } from "@/domain/repositories/users-repository"
import { WrongCredentialsError } from "@/domain/use-cases/errors/wrong-credentials-error"
import { Injectable } from "@nestjs/common"

interface AuthenticateClientUseCaseRequest {
  email: string
  password: string
}

type AuthenticateClientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateClientUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    const client = await this.usersRepository.findByEmail(email)

    if (!client) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      client.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: client.id.toString(),
      email: client.email,
      firstName: client.firstName,
      lastName: client.lastName,
      isAdmin: client.isAdmin,
    })

    return right({
      accessToken,
    })
  }
}
