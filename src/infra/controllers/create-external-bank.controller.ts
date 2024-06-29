import { Body, Controller, HttpCode, Post, UsePipes } from "@nestjs/common"
import { CurrentUser } from "../auth/current-user-decorator"
import { UserPayload } from "../auth/jwt.strategy"
import { z } from "zod"
import { CreateExternalBankUseCase } from "@/domain/use-cases/create-external-bank"
import { ZodValidationPipe } from "../http/pipes/zod-validation.pipe"

const createBankAccountBodySchema = z.object({
  accountHolderName: z.string(),
  iban: z.string(),
  bic: z.string(),
})

type CreateBankAccountBodySchema = z.infer<typeof createBankAccountBodySchema>

@Controller("/external-bank")
export class CreateBankExternalController {
  constructor(private createBankExternal: CreateExternalBankUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createBankAccountBodySchema))
  async handle(
    @Body() body: CreateBankAccountBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { accountHolderName, iban, bic } = body

    const result = await this.createBankExternal.execute({
      userId: user.sub,
      accountHolderName,

      iban,
      bic,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new Error(error.message)
    }

    return {
      message: "External bank created successfully",
    }
  }
}
