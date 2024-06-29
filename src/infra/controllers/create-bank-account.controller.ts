import { Controller, HttpCode, Post } from "@nestjs/common"
import { CurrentUser } from "../auth/current-user-decorator"
import { UserPayload } from "../auth/jwt.strategy"
import { CreateBankAccountUseCase } from "@/domain/use-cases/create-bank-account"

@Controller("/bank-account")
export class CreateBankAccountController {
  constructor(private createBankAccount: CreateBankAccountUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@CurrentUser() user: UserPayload) {
    const result = await this.createBankAccount.execute({
      userId: user.sub,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new Error(error.message)
    }

    return {
      message: "Bank account created successfully",
    }
  }
}
