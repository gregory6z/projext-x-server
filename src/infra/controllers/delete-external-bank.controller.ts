import { z } from "zod"

import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  UsePipes,
} from "@nestjs/common"
import { ZodValidationPipe } from "../http/pipes/zod-validation.pipe"
import { UserPayload } from "../auth/jwt.strategy"
import { CurrentUser } from "../auth/current-user-decorator"
import { DeleteExternalBankUseCase } from "@/domain/use-cases/delete-external-bank"

const deleteExternalBankBodySchema = z.object({
  externalBankId: z.string(),
})

type DeleteExternalBankBodySchema = z.infer<typeof deleteExternalBankBodySchema>

@Controller("/external-bank")
export class DeleteExternalBankController {
  constructor(private deleteExternalBank: DeleteExternalBankUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(deleteExternalBankBodySchema))
  async handle(
    @Body() body: DeleteExternalBankBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { externalBankId } = body

    const result = await this.deleteExternalBank.execute({
      userId: user.sub,
      externalBankId,
    })

    if (result.isLeft()) {
      const error = result.value
      throw new Error(error.message)
    }
  }
}
