import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { TransactionFactory } from "test/factories/make-transaction"
import { BankAccountFactory } from "test/factories/make-bank-account"
import { InvestmentPurchaseFactory } from "test/factories/make-investment-purchase"
import { InvestmentFactory } from "test/factories/make-investment"

describe("Fetch Investments Purchases (E2E)", () => {
  let app: INestApplication

  let userFactory: UserFactory
  let bankAccountFactory: BankAccountFactory

  let investmentFactory: InvestmentFactory
  let investmentPurchaseFactory: InvestmentPurchaseFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        UserFactory,
        TransactionFactory,
        BankAccountFactory,
        InvestmentFactory,
        InvestmentPurchaseFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    bankAccountFactory = moduleRef.get(BankAccountFactory)

    investmentFactory = moduleRef.get(InvestmentFactory)
    investmentPurchaseFactory = moduleRef.get(InvestmentPurchaseFactory)

    await app.init()
  })

  test("[GET] /investments-purchases", async () => {
    const user = await userFactory.makePrismaUser()

    const bankAccount = await bankAccountFactory.makePrismaBankAccount({
      userId: user.id.toString(),
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const investment = await investmentFactory.makePrismaInvestment()

    await investmentPurchaseFactory.makePrismaInvestmentPurchase({
      investmentId: investment.id.toString(),
      accountId: bankAccount.id.toString(),
      initialAmount: 200,
    })

    await investmentPurchaseFactory.makePrismaInvestmentPurchase({
      investmentId: investment.id.toString(),
      accountId: bankAccount.id.toString(),
      initialAmount: 200,
    })

    const response = await request(app.getHttpServer())
      .get(`/investments-purchases/${bankAccount.id.toString()}`) // Adicionando o accountId como parte do caminho

      .set("Authorization", `Bearer ${accessToken}`)

    console.log(response.body)

    expect(response.statusCode).toBe(200)

    expect(Array.isArray(response.body.investments)).toBeTruthy()

    expect(response.body.investments).toHaveLength(2)
  })

  test("[GET] /investment-purchases", async () => {
    const accessToken = "invalid-token"

    const response = await request(app.getHttpServer())
      .get(`/investments-purchases/123456`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })
})
