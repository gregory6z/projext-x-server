import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { PrismaService } from "../database/prisma/prisma.service"
import { BankAccountFactory } from "test/factories/make-bank-account"

describe("Create transaction (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService
  let bankAccountFactory: BankAccountFactory

  let userFactory: UserFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, BankAccountFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    bankAccountFactory = moduleRef.get(BankAccountFactory)

    await app.init()
  })

  test("[POST] /transaction", async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const bankAccount = await bankAccountFactory.makePrismaBankAccount({
      userId: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .post("/transaction")
      .send({
        amount: 100,
        type: "deposit",
        accountId: bankAccount.id.toString(),
      })

      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)

    const transactionOnDatabase = await prisma.transaction.findUnique({
      where: {
        accountId: bankAccount.id.toString(),
      },
    })

    expect(transactionOnDatabase).toBeTruthy()
  })

  test("[POST] /bank-account", async () => {
    const accessToken = "invalid-token"

    const response = await request(app.getHttpServer())
      .post("/bank-account")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })
})
