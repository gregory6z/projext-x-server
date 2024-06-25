import { UsersRepository } from "@/domain/repositories/users-repository"
import { BankAccount } from "@/domain/entities/bank-account"
import { Either, left, right } from "@/core/either"

import { BankAccountsRepository } from "../repositories/bank-accounts-repository"
import { Injectable } from "@nestjs/common"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

interface CreateBankAccountUseCaseRequest {
  userId: string
}

type CreateBankAccountUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    bankAccount: BankAccount
  }
>

@Injectable()
export class CreateBankAccountUseCase {
  constructor(
    private bankAccountRepository: BankAccountsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    userId,
  }: CreateBankAccountUseCaseRequest): Promise<CreateBankAccountUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const account = BankAccount.create({
      userId: user.id.toString(),
      availableWithdrawal: 0,
    })

    await this.bankAccountRepository.create(account)

    return right({
      bankAccount: account,
    })
  }
}
