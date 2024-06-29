import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { ExternalBankFactory } from "test/factories/make-external-bank"

describe("Delete external bank (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService

  let userFactory: UserFactory
  let externalBankFactory: ExternalBankFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ExternalBankFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)
    externalBankFactory = moduleRef.get(ExternalBankFactory)

    await app.init()
  })

  test("[DELETE] /delete external bank", async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const externalBank = await externalBankFactory.makePrismaExternalBank({
      userId: user.id.toString(),
    })

    const response = await request(app.getHttpServer())
      .delete("/external-bank")
      .set("Authorization", `Bearer ${accessToken}`)

      .send({
        externalBankId: externalBank.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.externalBank.findUnique({
      where: {
        id: externalBank.id.toString(),
      },
    })

    expect(userOnDatabase).toBeNull()
  })
  test("[DELETE] /external-bank", async () => {
    const accessToken = "invalid-token"

    const response = await request(app.getHttpServer())
      .post("/bank-account")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })
})
