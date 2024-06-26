import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { BankAccountsRepository } from "@/domain/repositories/bank-accounts-repository"
import { PrismaBankAccountsRepository } from "./prisma/repositories/prisma-bank-accounts-repository"
import { ExternalBanksRepository } from "@/domain/repositories/external-banks-repository"
import { PrismaExternalBanksRepository } from "./prisma/repositories/prisma-external-banks-repository"
import { InvestmentPurchaseRepository } from "@/domain/repositories/investiment-purchase"
import { PrismaInvestmentPurchasesRepository } from "./prisma/repositories/prisma-investment-purchases"
import { InvestmentsRepository } from "@/domain/repositories/investiments-repository"
import { PrismaInvestmentsRepository } from "./prisma/repositories/prisma-investment-repository"
import { TransactionsRepository } from "@/domain/repositories/transactions-repository"
import { PrismaTransactionsRepository } from "./prisma/repositories/prisma-transactions-repository"
import { UsersRepository } from "@/domain/repositories/users-repository"
import { PrismaUsersRepository } from "./prisma/repositories/prisma-users-repository"

@Module({
  providers: [
    PrismaService,
    {
      provide: BankAccountsRepository,
      useClass: PrismaBankAccountsRepository,
    },
    {
      provide: ExternalBanksRepository,
      useClass: PrismaExternalBanksRepository,
    },
    {
      provide: InvestmentPurchaseRepository,
      useClass: PrismaInvestmentPurchasesRepository,
    },
    {
      provide: InvestmentsRepository,
      useClass: PrismaInvestmentsRepository,
    },
    {
      provide: TransactionsRepository,
      useClass: PrismaTransactionsRepository,
    },
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
  ],
  exports: [
    PrismaService,
    BankAccountsRepository,
    ExternalBanksRepository,
    InvestmentPurchaseRepository,
    InvestmentsRepository,
    TransactionsRepository,
    UsersRepository,
  ],
})
export class DatabaseModule {}
