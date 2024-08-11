import { Module } from "@nestjs/common"
import { DatabaseModule } from "../database/database.module"
import { CheckAndActivateInvestmentUseCase } from "@/domain/use-cases/check-and-activate-investment"
import { CreateBankAccountUseCase } from "@/domain/use-cases/create-bank-account"
import { CreateExternalBankUseCase } from "@/domain/use-cases/create-external-bank"
import { CreateInvestmentUseCase } from "@/domain/use-cases/create-investment"
import { CreateTransactionUseCase } from "@/domain/use-cases/create-transaction"
import { CreateUserUseCase } from "@/domain/use-cases/create-user"
import { DeleteExternalBankUseCase } from "@/domain/use-cases/delete-external-bank"
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
import { CreateAccountController } from "../controllers/create-account.controller"
import { CreateInvestmentController } from "../controllers/create-investment.controller"
import { FetchInvestmentController } from "../controllers/fetch-investment.controller"
import { AuthenticateClientUseCase } from "../auth/authenticate.use-case"
import { AuthenticateController } from "../auth/authenticate-client.controller"
import { CreateBankAccountController } from "../controllers/create-bank-account.controller"
import { CreateBankExternalController } from "../controllers/create-external-bank.controller"
import { DeleteExternalBankController } from "../controllers/delete-external-bank.controller"
import { CreateTransactionController } from "../controllers/create-transaction.controller"
import { UpdateUserContactInfoUseCaseUseCase } from "@/domain/use-cases/update-user-contact-info"
import { UpdateUserContactInfoController } from "../controllers/update-user-contact-info.controller"
import { CreateInvestmentPurchaseUseCase } from "@/domain/use-cases/create-investment-purchase"
import { FetchTransactionsController } from "../controllers/fetch-transactions"
import { RegisterInvestmentPurchaseController } from "../controllers/register-investment-purchase.controller"
import { GetUserController } from "../controllers/get-user.controller"
import { GetUserUseCase } from "@/domain/use-cases/get-user"
import { FetchInvestmentPurchaseController } from "../controllers/fetch-investments-purchases.controller"
import { WebhookController } from "../controllers/webhook.controller"
import { SquareModule } from "../payment/square/square.module"

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule, SquareModule],
  controllers: [
    CreateAccountController,
    CreateInvestmentController,
    AuthenticateController,
    FetchInvestmentController,
    CreateBankAccountController,
    CreateBankExternalController,
    DeleteExternalBankController,
    CreateTransactionController,
    UpdateUserContactInfoController,
    FetchTransactionsController,
    RegisterInvestmentPurchaseController,
    GetUserController,
    FetchInvestmentPurchaseController,
    WebhookController,
  ],
  providers: [
    CheckAndActivateInvestmentUseCase,
    CreateBankAccountUseCase,
    CreateExternalBankUseCase,
    CreateInvestmentUseCase,
    CreateTransactionUseCase,
    CreateUserUseCase,
    DeleteExternalBankUseCase,
    UpdateUserContactInfoUseCaseUseCase,
    FetchInvestmentPurchaseByAccountIdUseCase,
    FetchInvestmentsUseCase,
    FetchTransactionsUseCase,
    GetBalanceUseCase,
    RegisterInvestmentPurchaseUseCase,
    UpdateStatusInvestmentPurchaseUseCase,
    UpdateTransactionStatusUseCase,
    AddMonthlyProfitUseCase,
    AuthenticateClientUseCase,
    CreateInvestmentPurchaseUseCase,
    GetUserUseCase,
  ],
})
export class HttpModule {}
