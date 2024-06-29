import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Transaction, TransactionProps } from "@/domain/entities/transaction"
import { fakerFR } from "@faker-js/faker"

export function makeTransaction(
  override: Partial<TransactionProps> = {},
  id?: UniqueEntityID,
) {
  const transaction = Transaction.create(
    {
      amount: 100,
      type: "deposit",

      accountId: fakerFR.string.uuid(),

      ...override,
    },
    id,
  )

  return transaction
}
