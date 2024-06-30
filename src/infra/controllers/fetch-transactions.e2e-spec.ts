import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { TransactionFactory } from "test/factories/make-transaction"
import { BankAccountFactory } from "test/factories/make-bank-account"

describe("Fetch transactions (E2E)", () => {
  let app: INestApplication

  let userFactory: UserFactory
  let transactionFactory: TransactionFactory
  let bankAccountFactory: BankAccountFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TransactionFactory, BankAccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    transactionFactory = moduleRef.get(TransactionFactory)
    bankAccountFactory = moduleRef.get(BankAccountFactory)

    await app.init()
  })

  test("[GET] /:accountId/transactions", async () => {
    const user = await userFactory.makePrismaUser()

    const bankAccount = await bankAccountFactory.makePrismaBankAccount({
      userId: user.id.toString(),
    })

    const firstTransaction = await transactionFactory.makePrismaTransaction({
      accountId: bankAccount.id.toString(),
      amount: 100,
      type: "deposit",
    })

    const secondTransaction = await transactionFactory.makePrismaTransaction({
      accountId: bankAccount.id.toString(),
      amount: 100,
      type: "deposit",
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .get(`/${bankAccount.id.toString()}/transactions`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      transactions: expect.arrayContaining([
        expect.objectContaining({
          id: firstTransaction.id.toString(),
        }),
        expect.objectContaining({
          id: secondTransaction.id.toString(),
        }),
      ]),
    })
  })

  test("[GET] /:accountId/transactions", async () => {
    const accessToken = "invalid-token"

    const invalidId = "invalid-id"

    const response = await request(app.getHttpServer())
      .get(`/${invalidId}/transactions`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })
})
