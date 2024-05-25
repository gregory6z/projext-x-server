import { Either, left, right } from "@/core/either"
import { InvestmentsRepository } from "../repositories/investiments-repository"
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error"

type UpdateFundraisingProgressUseCaseUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    progress: number
  }
>

interface UpdateFundraisingProgressUseCaseUseCaseRequest {
  createdAt: Date
  numberOfWeeks: number
  investmentId: string
}

export class UpdateFundraisingProgressUseCaseUseCase {
  constructor(private investmentsRepository: InvestmentsRepository) {}

  async execute({
    createdAt,
    numberOfWeeks,
    investmentId,
  }: UpdateFundraisingProgressUseCaseUseCaseRequest): Promise<UpdateFundraisingProgressUseCaseUseCaseResponse> {
    const progress = this.updateFundraisingProgressUseCase(
      createdAt,
      numberOfWeeks,
    )

    try {
      setInterval(
        async () => {
          const progress = this.updateFundraisingProgressUseCase(
            createdAt,
            numberOfWeeks,
          )
          const investmentToUpdate =
            await this.investmentsRepository.findById(investmentId)

          if (!investmentToUpdate) {
            return left(new ResourceNotFoundError())
          }

          investmentToUpdate.fundraisingProgress.current = progress

          if (progress === 100) {
            investmentToUpdate.status = "active"
          }

          await this.investmentsRepository.update(investmentToUpdate)
        },
        1000 * 60 * 60 * 24, // 1 dia em milissegundos
      )

      return right({
        progress,
      })
    } catch (error) {
      return left(new ResourceNotFoundError())
    }
  }

  private updateFundraisingProgressUseCase(
    createdAt: Date,
    numberOfWeeks: number,
  ): number {
    const now = new Date()
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7 // 1 week in milliseconds
    const weeksSinceCreation =
      (now.getTime() - createdAt.getTime()) / millisecondsPerWeek

    if (weeksSinceCreation >= numberOfWeeks) {
      return 100
    } else {
      return (weeksSinceCreation / numberOfWeeks) * 100
    }
  }
}
