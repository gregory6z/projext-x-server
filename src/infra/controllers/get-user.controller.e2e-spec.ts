import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { TransactionFactory } from "test/factories/make-transaction"
import { BankAccountFactory } from "test/factories/make-bank-account"

describe("Get User (E2E)", () => {
  let app: INestApplication

  let userFactory: UserFactory
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
    bankAccountFactory = moduleRef.get(BankAccountFactory)

    await app.init()
  })

  test("[GET] /get-user", async () => {
    const user = await userFactory.makePrismaUser({
      firstName: "John",
    })

    await bankAccountFactory.makePrismaBankAccount({
      userId: user.id.toString(),
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .get(`/get-user`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    expect(response.body).toEqual({
      user: expect.objectContaining({
        firstName: "John",
      }),
      bankAccount: expect.objectContaining({
        userId: user.id.toString(),
      }),
    })
  })

  test("[GET] /get-user", async () => {
    const accessToken = "invalid-token"

    const response = await request(app.getHttpServer())
      .get(`/get-user`)
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })
})
