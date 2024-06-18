import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { BankAccount, BankAccountProps } from "@/domain/entities/bank-account"
import { fakerFR } from "@faker-js/faker"

export function makeBankAccount(
  override: Partial<BankAccountProps> = {},
  id?: UniqueEntityID,
) {
  const bankExternal = BankAccount.create(
    {
      userId: fakerFR.string.uuid(),
      ...override,
    },
    id,
  )

  return bankExternal
}
