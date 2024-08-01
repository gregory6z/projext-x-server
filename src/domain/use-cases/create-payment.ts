import { Either, right, left } from "@/core/either"
import { BadRequestException, Injectable } from "@nestjs/common"
import { PaymentService } from "../payment/payment-service"

interface CreatePaymentUseCaseRequest {
  amount: number
  currency: string
  paymentMethod: {
    type: string
    fields: {
      number: string
      expiration_month: string
      expiration_year: string
      cvv: string
    }
  }
}

type CreatePaymentUseCaseResponse = Either<
  BadRequestException,
  {
    paymentId: string
    amount: number
    currency: string
    status: string
  }
>

@Injectable()
export class CreatePaymentUseCase {
  constructor(private paymentService: PaymentService) {}

  async execute({
    amount,
    currency,
    paymentMethod,
  }: CreatePaymentUseCaseRequest): Promise<CreatePaymentUseCaseResponse> {
    try {
      const paymentResponse = await this.paymentService.createPayment(
        amount,
        currency,
        paymentMethod,
      )

      if (paymentResponse.status.status !== "SUCCESS") {
        throw new BadRequestException(paymentResponse.status.message)
      }

      return right({
        paymentId: paymentResponse.data.id,
        amount: paymentResponse.data.amount,
        currency: paymentResponse.data.currency,
        status: paymentResponse.data.status,
      })
    } catch (error) {
      return left(new BadRequestException((error as Error).message))
    }
  }
}
