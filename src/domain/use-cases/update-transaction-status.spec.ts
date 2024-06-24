import { InMemoryTransactionsRepository } from "test/repositories/in-memory-transaction-repository"
import { UpdateTransactionStatusUseCase } from "./update-transaction-status"
import { makeTransaction } from "test/factories/make-transaction"

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: UpdateTransactionStatusUseCase

describe("Update Transaction Status", () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new UpdateTransactionStatusUseCase(inMemoryTransactionsRepository)
  })

  it("should be able to update a transaction status", async () => {
    const transaction = makeTransaction()

    inMemoryTransactionsRepository.items.push(transaction)

    const result = await sut.execute({
      transactionId: transaction.id.toString(),
      status: "completed",
    })

    expect(result.isRight()).toBe(true)

    if ("transaction" in result.value) {
      const updatedTransaction = result.value.transaction

      expect(updatedTransaction.id).toEqual(transaction.id)
      expect(updatedTransaction.status).toEqual("completed")
    }
  })
})
