import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module"
import { CheckAndActivateInvestmentUseCase } from "@/domain/use-cases/check-and-activate-investment"
import { CreateBankAccountUseCase } from "@/domain/use-cases/create-bank-account"
import { CreateExternalBankUseCase } from "@/domain/use-cases/create-external-bank"
import { CreateInvestmentUseCase } from "@/domain/use-cases/create-investment"
import { CreateTransactionUseCase } from "@/domain/use-cases/create-transaction"
import { CreateUserUseCase } from "@/domain/use-cases/create-user"
import { DeleteExternalBankUseCase } from "@/domain/use-cases/delete-external-bank"
import { EditUserUseCase } from "@/domain/use-cases/edit-user"
import { FetchInvestmentPurchaseByAccountIdUseCase } from "@/domain/use-cases/fetch-investment-purchase-by-account"
import { FetchInvestmentsUseCase } from "@/domain/use-cases/fetch-investments"
import { FetchTransactionsUseCase } from "@/domain/use-cases/fetch-transactions"
import { GetBalanceUseCase } from "@/domain/use-cases/get-balance"
import { RegisterInvestmentPurchaseUseCase } from "@/domain/use-cases/register-investment-purchase"
import { UpdateStatusInvestmentPurchaseUseCase } from "@/domain/use-cases/update-investment-purchase-status"
import { UpdateTransactionStatusUseCase } from "@/domain/use-cases/update-transaction-status"
import { AddMonthlyProfitUseCase } from "@/domain/use-cases/add-monthly-profit"
import { CryptographyModule } from "../cryptography/cryptography.module"
import { AuthModule } from "../auth/auth.module"

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [],
  providers: [
    CheckAndActivateInvestmentUseCase,
    CreateBankAccountUseCase,
    CreateExternalBankUseCase,
    CreateInvestmentUseCase,
    CreateTransactionUseCase,
    CreateUserUseCase,
    DeleteExternalBankUseCase,
    EditUserUseCase,
    FetchInvestmentPurchaseByAccountIdUseCase,
    FetchInvestmentsUseCase,
    FetchTransactionsUseCase,
    GetBalanceUseCase,
    RegisterInvestmentPurchaseUseCase,
    UpdateStatusInvestmentPurchaseUseCase,
    UpdateTransactionStatusUseCase,
    AddMonthlyProfitUseCase,
  ],
})
export class HttpModule {}
