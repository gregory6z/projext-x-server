import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { UsersRepository } from "../repositories/users-repository"
import { Encrypter } from "@/core/cryptography/encrypter"
import { HashGenerator } from "@/core/cryptography/hash-generator"
import { Injectable, NotFoundException } from "@nestjs/common"

interface EditUserUseCaseRequest {
  address?: string
  userId: string
  phone?: string
  password?: string
}

type EditUserUseCaseResponse = Either<
  NotAllowedError,
  {
    accessToken: string
  }
>

@Injectable()
export class EditUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private encrypter: Encrypter,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    address,
    userId,
    phone,
    password,
  }: EditUserUseCaseRequest): Promise<EditUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new NotFoundException())
    }

    if (password) {
      const hashedPassword = await this.hashGenerator.hash(password)
      user.password = hashedPassword
    }

    if (address) {
      user.address = address
    }

    if (phone) {
      user.phone = phone
    }

    await this.userRepository.update(user)

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    })

    return right({
      accessToken,
    })
  }
}
