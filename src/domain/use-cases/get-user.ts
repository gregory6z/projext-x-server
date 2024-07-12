import { Either, left, right } from "@/core/either"
import { UsersRepository } from "../repositories/users-repository"
import { User } from "../entities/user"
import { BadRequestException, Injectable } from "@nestjs/common"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"
import { BankAccount } from "../entities/bank-account"

interface GetUserUseCaseRequest {
  userId: string
}

type GetUserUseCaseResponse = Either<
  BadRequestException,
  {
    user: User
    bankAccount: BankAccount
  }
>

@Injectable()
export class GetUserUseCase {
  constructor(
    private userRepository: UsersRepository,
    private bankAccountsRepository: BankAccountsRepository,
  ) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new BadRequestException())
    }

    const bankAccount = await this.bankAccountsRepository.findByUserId(userId)

    console.log(bankAccount)

    if (!bankAccount) {
      return left(new BadRequestException())
    }

    return right({
      user,
      bankAccount,
    })
  }
}
