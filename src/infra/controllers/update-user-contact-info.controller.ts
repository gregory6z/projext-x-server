import { z } from "zod"

import {
  BadRequestException,
  Body,
  Controller,
  Put,
  UsePipes,
} from "@nestjs/common"
import { ZodValidationPipe } from "../http/pipes/zod-validation.pipe"
import { UserPayload } from "../auth/jwt.strategy"
import { CurrentUser } from "../auth/current-user-decorator"
import { UpdateUserContactInfoUseCaseUseCase } from "@/domain/use-cases/update-user-contact-info"

const updateUserContactInfoBodySchema = z
  .object({
    address: z.string().optional(),
    phone: z.string().optional(),
    customerId: z.string().optional(),
  })
  .refine(
    (data) =>
      data.address != null || data.phone != null || data.customerId != null,
    {
      message: "Either address, phone, or customerId must be provided.",
    },
  )

type UpdateUserContactInfoBodySchema = z.infer<
  typeof updateUserContactInfoBodySchema
>

@Controller("/user/contact-info")
export class UpdateUserContactInfoController {
  constructor(
    private registerInvestment: UpdateUserContactInfoUseCaseUseCase,
  ) {}

  @Put()
  @UsePipes(new ZodValidationPipe(updateUserContactInfoBodySchema))
  async handle(
    @Body() body: UpdateUserContactInfoBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { address, phone, customerId } = body

    const result = await this.registerInvestment.execute({
      address,
      phone,
      customerId,
      userId: user.sub,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
    return {
      message: "User contact info updated successfully.",
    }
  }
}
