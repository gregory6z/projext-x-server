import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { BankAccount, BankAccountProps } from "@/domain/entities/bank-account"
import { PrismaBankAccountsMapper } from "@/infra/database/prisma/mappers/prisma-bank-account-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { fakerFR } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

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

@Injectable()
export class BankAccountFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaBankAccount(
    data: Partial<BankAccountProps> = {},
  ): Promise<BankAccount> {
    const bankAccount = makeBankAccount(data)

    await this.prisma.bankAccount.create({
      data: PrismaBankAccountsMapper.toPrisma(bankAccount),
    })

    return bankAccount
  }
}
