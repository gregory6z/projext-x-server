import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { UsersRepository } from "../repositories/users-repository"
import { Encrypter } from "@/core/cryptography/encrypter"
import { Injectable, NotFoundException } from "@nestjs/common"

interface UpdateUserContactInfoUseCaseUseCaseRequest {
  address?: string
  userId: string
  phone?: string
}

type UpdateUserContactInfoUseCaseUseCaseResponse = Either<
  NotAllowedError,
  {
    accessToken: string
  }
>

@Injectable()
export class UpdateUserContactInfoUseCaseUseCase {
  constructor(
    private userRepository: UsersRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    address,
    userId,
    phone,
  }: UpdateUserContactInfoUseCaseUseCaseRequest): Promise<UpdateUserContactInfoUseCaseUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new NotFoundException())
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
