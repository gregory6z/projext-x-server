import { Either, left, right } from "@/core/either"
import { UsersRepository } from "../repositories/users-repository"
import { User } from "../entities/user"
import { BadRequestException, Injectable } from "@nestjs/common"

interface GetUserUseCaseRequest {
  userId: string
}

type GetUserUseCaseResponse = Either<
  BadRequestException,
  {
    user: User
  }
>

@Injectable()
export class GetUserUseCase {
  constructor(private userRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const userLogin = await this.userRepository.findById(userId)

    if (!userLogin) {
      return left(new BadRequestException())
    }

    return right({
      user: userLogin,
    })
  }
}
