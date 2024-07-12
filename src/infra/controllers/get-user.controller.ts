/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get } from "@nestjs/common"
import { GetUserUseCase } from "@/domain/use-cases/get-user"
import { BankAccountPresenter } from "../presenters/bankAccount.presenter"
import { UserPresenter } from "../presenters/user.presenter"
import { UserPayload } from "../auth/jwt.strategy"
import { CurrentUser } from "../auth/current-user-decorator"

@Controller("/get-user")
export class GetUserController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  @Get()
  async handle(@CurrentUser() userSub: UserPayload) {
    const result = await this.getUserUseCase.execute({
      userId: userSub.sub,
    })

    if (result.isLeft()) {
      throw new Error("erro fetch")
    }

    const user = result.value.user
    const bankAccount = result.value.bankAccount

    return {
      user: UserPresenter.toHTTP(user),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bankAccount: BankAccountPresenter.toHTTP(bankAccount),
    }
  }
}
