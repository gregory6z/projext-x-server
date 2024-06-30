/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Param } from "@nestjs/common"
import { FetchTransactionsUseCase } from "@/domain/use-cases/fetch-transactions"
import { TransactionPresenter } from "../presenters/transaction.presenter"

@Controller("/:accountId/transactions")
export class FetchTransactionsController {
  constructor(private fetchTransactions: FetchTransactionsUseCase) {}

  @Get()
  async handle(@Param("accountId") accountId: string) {
    const result = await this.fetchTransactions.execute({
      accountId,
    })

    if (result.isLeft()) {
      throw new Error("erro fetch")
    }

    const transactions = result.value.transactions

    return {
      transactions: transactions.map((transaction: any) =>
        TransactionPresenter.toHTTP(transaction),
      ),
    }
  }
}
