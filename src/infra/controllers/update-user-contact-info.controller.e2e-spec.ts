import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"
import { PrismaService } from "../database/prisma/prisma.service"

describe("Update user contact info (E2E)", () => {
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

  test("[PUT] /user/contact-info", async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .put("/user/contact-info")
      .send({
        phone: "123456789",
      })

      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: user.id.toString(),
      },
    })

    expect(userOnDatabase?.phone === "123456789").toBeTruthy()
  })

  test("[PUT] /user/contact-info", async () => {
    const accessToken = "invalid-token"

    const response = await request(app.getHttpServer())
      .put("/user/contact-info")
      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(401)
  })

  test("[PUT] /user/contact-info", async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .put("/user/contact-info")
      .send()

      .set("Authorization", `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(400)

    console.log(response.body)
  })
})
