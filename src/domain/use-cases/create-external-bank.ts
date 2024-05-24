import { Either, left, right } from "@/core/either"

import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { ExternalBank } from "../entities/external-bank"
import { ExternalBanksRepository } from "../repositories/external-banks-repository"
import { UsersRepository } from "../repositories/users-repository"

interface CreateExternalBankUseCaseRequest {
  accountHolderName: string
  accountNumber: string
  iban: string
  bic: string
  userId: string
}

type CreateExternalBankUseCaseResponse = Either<
  WrongCredentialsError,
  {
    externalBank: ExternalBank
  }
>

export class CreateExternalBankUseCase {
  constructor(
    private externalBankRepository: ExternalBanksRepository,
    private userRepository: UsersRepository,
  ) {}

  async execute({
    userId,
    accountHolderName,
    bic,
    iban,
    accountNumber,
  }: CreateExternalBankUseCaseRequest): Promise<CreateExternalBankUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const account = ExternalBank.create({
      userId: user.id.toString(),
      accountHolderName,
      bic,
      accountNumber,
      iban,
    })

    await this.externalBankRepository.create(account)

    return right({
      externalBank: account,
    })
  }
}
