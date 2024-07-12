/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Param } from "@nestjs/common"
import { GetUserUseCase } from "@/domain/use-cases/get-user"
import { TransactionPresenter } from "../presenters/transaction.presenter"
import { BankAccountPresenter } from "../presenters/bankAccount.presenter"
import { UserPresenter } from "../presenters/user.presenter"

@Controller("/get-user/")
export class FetchTransactionsController {
  constructor(private getUserUseCase: GetUserUseCase) {}

  @Get()
  async handle(@Param("userId") userId: string) {
    const result = await this.getUserUseCase.execute({
      userId,
    })

    if (result.isLeft()) {
      throw new Error("erro fetch")
    }

    const user = result.value.user
    const bankAccount = result.value.bankAccount
    const transactions = result.value.transactions

    return {
      user: UserPresenter.toHTTP(user),

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      bankAccount: BankAccountPresenter.toHTTP(bankAccount),
      transactions: transactions.map((transaction: any) =>
        TransactionPresenter.toHTTP(transaction),
      ),
    }
  }
}
