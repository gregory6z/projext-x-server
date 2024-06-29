import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { PrismaService } from "../database/prisma/prisma.service"

describe("Create external Bank account (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService

  let userFactory: UserFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test("[POST] /external-bank", async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .post("/external-bank")
      .send({
        iban: "123456",
        bic: "123456",
        accountHolderName: "John Doe",

        userId: user.id.toString(),
      })

      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.externalBank.findUnique({
      where: {
        userId: user.id.toString(),
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })

  test("[POST] /bank-account", async () => {
    const accessToken = "invalid-token"

    const response = await request(app.getHttpServer())
      .post("/bank-account")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })
})
