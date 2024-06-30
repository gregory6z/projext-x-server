import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { BankAccountFactory } from "test/factories/make-bank-account"
import { InvestmentFactory } from "test/factories/make-investment"
import { PrismaService } from "../database/prisma/prisma.service"

describe("Register investment purchase (E2E)", () => {
  let app: INestApplication

  let userFactory: UserFactory

  let bankAccountFactory: BankAccountFactory
  let investmentFactory: InvestmentFactory
  let prisma: PrismaService

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, InvestmentFactory, BankAccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    bankAccountFactory = moduleRef.get(BankAccountFactory)
    investmentFactory = moduleRef.get(InvestmentFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test("[POST] /:accountId/investment-purchase", async () => {
    const user = await userFactory.makePrismaUser()

    const bankAccount = await bankAccountFactory.makePrismaBankAccount({
      userId: user.id.toString(),
    })

    const investment = await investmentFactory.makePrismaInvestment()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const investmentId = investment.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/${bankAccount.id.toString()}/investment-purchase`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        investmentId,
        initialAmount: 100,
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.investmentPurchase.findUnique({
      where: {
        investmentId: investment.id.toString(),
      },
    })

    console.log(userOnDatabase)

    expect(userOnDatabase).toBeTruthy()
  })

  test("[POST] /:accountId/investment-purchase", async () => {
    const accessToken = "invalid-token"

    const invalidId = "invalid-id"

    const response = await request(app.getHttpServer())
      .post(`/${invalidId}/investment-purchase`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })
})
