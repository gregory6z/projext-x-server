import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  ExternalBank,
  ExternalBankProps,
} from "@/domain/entities/external-bank"
import { PrismaExternalBanksMapper } from "@/infra/database/prisma/mappers/prisma-external-bank-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { fakerFR } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

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

@Injectable()
export class ExternalBankFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaExternalBank(
    data: Partial<ExternalBankProps> = {},
  ): Promise<ExternalBank> {
    const externalBank = makeExternalBank(data)

    await this.prisma.externalBank.create({
      data: PrismaExternalBanksMapper.toPrisma(externalBank),
    })

    return externalBank
  }
}
