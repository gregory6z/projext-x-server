import { UsersRepository } from "@/domain/repositories/users-repository"
import { BankAccount } from "@/domain/entities/bank-account"
import { Either, left, right } from "@/core/either"

import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { BankAccountsRepository } from "../repositories/bank-accounts-repository"

interface CreateBankAccountUseCaseRequest {
  userId: string
}

type CreateBankAccountUseCaseResponse = Either<
  WrongCredentialsError,
  {
    bankAccount: BankAccount
  }
>

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
      return left(new WrongCredentialsError())
    }

    const account = BankAccount.create({
      userId: user.id.toString(),
    })

    await this.bankAccountRepository.create(account)

    return right({
      bankAccount: account,
    })
  }
}
