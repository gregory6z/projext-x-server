import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ExternalBank } from "@/domain/entities/external-bank"
import { ExternalBank as PrismaExternalBank, Prisma } from "@prisma/client"

export class PrismaExternalBanksMapper {
  static toDomain(raw: PrismaExternalBank): ExternalBank {
    return ExternalBank.create(
      {
        userId: raw.userId,
        accountHolderName: raw.accountHolderName,

        iban: raw.iban,
        bic: raw.bic,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    externalBank: ExternalBank,
  ): Prisma.ExternalBankUncheckedCreateInput {
    return {
      id: externalBank.id.toString(),
      userId: externalBank.userId,
      accountHolderName: externalBank.accountHolderName,

      iban: externalBank.iban,
      bic: externalBank.bic,
    }
  }
}
