import { z } from "zod"

import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common"
import { ZodValidationPipe } from "../http/pipes/zod-validation.pipe"
import { CreateInvestmentUseCase } from "@/domain/use-cases/create-investment"
import { UserPayload } from "../auth/jwt.strategy"
import { CurrentUser } from "../auth/current-user-decorator"

const createInvestmentBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  imageUrl: z.string(),
  investmentType: z.string(),
  annualProfit: z.number(),
  fundraisingProgress: z.object({
    current: z.number(),
    numberOfWeeks: z.number(),
  }),
  term: z.number(),
  risk: z.string(),
})

type CreateInvestmentBodySchema = z.infer<typeof createInvestmentBodySchema>

@Controller("/investments")
export class CreateInvestmentController {
  constructor(private registerInvestment: CreateInvestmentUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createInvestmentBodySchema))
  async handle(
    @Body() body: CreateInvestmentBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    if (!user.isAdmin) {
      throw new UnauthorizedException()
    }
    const {
      name,
      description,
      imageUrl,
      investmentType,
      annualProfit,
      fundraisingProgress,
      term,
      risk,
    } = body

    const result = await this.registerInvestment.execute({
      name,
      description,
      imageUrl,
      investmentType,
      annualProfit,
      fundraisingProgress,
      term,
      risk,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
