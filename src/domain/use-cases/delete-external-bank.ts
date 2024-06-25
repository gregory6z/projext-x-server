import { Either, left, right } from "@/core/either"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { ExternalBanksRepository } from "../repositories/external-banks-repository"
import { Injectable } from "@nestjs/common"

interface DeleteExternalBankUseCaseRequest {
  userId: string
  externalBankId: string
}

type DeleteExternalBankUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteExternalBankUseCase {
  constructor(private externalBanksRepository: ExternalBanksRepository) {}

  async execute({
    userId,
    externalBankId,
  }: DeleteExternalBankUseCaseRequest): Promise<DeleteExternalBankUseCaseResponse> {
    const externalBank =
      await this.externalBanksRepository.findById(externalBankId)

    if (!externalBank) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== externalBank.userId.toString()) {
      return left(new NotAllowedError())
    }

    await this.externalBanksRepository.delete(externalBank)

    return right(null)
  }
}
