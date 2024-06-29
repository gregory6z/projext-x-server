import { Either, left, right } from "@/core/either"

import { ExternalBank } from "../entities/external-bank"
import { ExternalBanksRepository } from "../repositories/external-banks-repository"
import { UsersRepository } from "../repositories/users-repository"
import { Injectable } from "@nestjs/common"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

interface CreateExternalBankUseCaseRequest {
  accountHolderName: string
  iban: string
  bic: string
  userId: string
}

type CreateExternalBankUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    externalBank: ExternalBank
  }
>

@Injectable()
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
  }: CreateExternalBankUseCaseRequest): Promise<CreateExternalBankUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError())
    }

    const account = ExternalBank.create({
      userId: user.id.toString(),
      accountHolderName,
      bic,
      iban,
    })

    await this.externalBankRepository.create(account)

    return right({
      externalBank: account,
    })
  }
}
