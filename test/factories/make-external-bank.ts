import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  ExternalBank,
  ExternalBankProps,
} from "@/domain/entities/external-bank"
import { fakerFR } from "@faker-js/faker"

export function makeExternalBank(
  override: Partial<ExternalBankProps> = {},
  id?: UniqueEntityID,
) {
  const bankExternal = ExternalBank.create(
    {
      userId: fakerFR.string.uuid(),
      accountHolderName: fakerFR.person.fullName(),
      iban: fakerFR.finance.iban(),
      bic: fakerFR.finance.bic(),
      ...override,
    },
    id,
  )

  return bankExternal
}
