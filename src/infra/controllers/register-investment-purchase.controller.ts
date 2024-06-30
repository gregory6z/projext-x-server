import { z } from "zod"

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
} from "@nestjs/common"

import { RegisterInvestmentPurchaseUseCase } from "@/domain/use-cases/register-investment-purchase"

const registerInvestmentPurchaseBodySchema = z.object({
  investmentId: z.string(),
  initialAmount: z.number(),
})

type RegisterInvestmentPurchaseBodySchema = z.infer<
  typeof registerInvestmentPurchaseBodySchema
>

@Controller("/:accountId/investment-purchase")
export class RegisterInvestmentPurchaseController {
  constructor(private registerInvestment: RegisterInvestmentPurchaseUseCase) {}

  @Post()
  @HttpCode(201)
  // @UsePipes(new ZodValidationPipe(registerInvestmentPurchaseBodySchema))
  async handle(
    @Body() body: RegisterInvestmentPurchaseBodySchema,
    @Param("accountId") accountId: string,
  ) {
    const { investmentId, initialAmount } = body

    const result = await this.registerInvestment.execute({
      accountId,
      investmentId,

      initialAmount,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return result
  }
}
