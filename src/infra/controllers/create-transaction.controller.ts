import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../http/pipes/zod-validation.pipe"
import { CreateTransactionUseCase } from "@/domain/use-cases/create-transaction"
import { TransactionPresenter } from "../presenters/transaction.presenter"

const createTransactionBodySchema = z.object({
  accountId: z.string(),
  type: z.enum(["deposit", "withdrawal"]),

  amount: z.number(),
})

type CreateTransactionBodySchema = z.infer<typeof createTransactionBodySchema>

@Controller("/transaction")
export class CreateTransactionController {
  constructor(private createTransaction: CreateTransactionUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTransactionBodySchema))
  async handle(
    @Body() body: CreateTransactionBodySchema,
    // @CurrentUser() user: UserPayload,
  ) {
    const { accountId, type, amount } = body

    const result = await this.createTransaction.execute({
      accountId,
      type,
      amount,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new Error(error.message)
    }

    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      transaction: TransactionPresenter.toHTTP(result.value.transaction),
    }
  }
}
