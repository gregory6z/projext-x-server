import { z } from "zod"

import { Public } from "@/infra/auth/public"
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from "@nestjs/common"
import { CreateUserUseCase } from "@/domain/use-cases/create-user"
import { ZodValidationPipe } from "../http/pipes/zod-validation.pipe"
import { UserAlreadyExistsError } from "@/domain/use-cases/errors/user-already-exists-error"

const createAccountBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
  firstName: z.string(),
  address: z.string(),
  birthDate: z.coerce.date(),
  lastName: z.string(),
  phone: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller("/accounts")
@Public()
export class CreateAccountController {
  constructor(private registerUser: CreateUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { email, password, firstName, address, lastName, phone, birthDate } =
      body

    const result = await this.registerUser.execute({
      email,
      firstName,
      password,
      address,
      lastName,
      phone,
      birthDate,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
