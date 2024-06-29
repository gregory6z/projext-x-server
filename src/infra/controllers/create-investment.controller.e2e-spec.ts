import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { UserFactory } from "test/factories/make-user"
import { DatabaseModule } from "../database/database.module"

describe("Create Investment (E2E)", () => {
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

  test("[POST] /investments", async () => {
    const user = await userFactory.makePrismaUser({
      isAdmin: true,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .post("/investments")
      .set("Authorization", `Bearer ${accessToken}`)

      .send({
        name: "Investment",
        description: "lorem ipsum",
        imageUrl: "img.jpg",
        investmentType: "bourse",
        annualProfit: 1.5,
        fundraisingProgress: {
          current: 0,
          numberOfWeeks: 2,
        },
        term: 4,
        risk: "low",
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.investment.findUnique({
      where: {
        name: "Investment",
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
  it("should return 400 for invalid data", async () => {
    const user = await userFactory.makePrismaUser({
      isAdmin: true,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .post("/investments")
      .set("Authorization", `Bearer ${accessToken}`)

      .send({
        email: "not-an-email",
      })

    expect(response.statusCode).toBe(400)
  })

  it("should return 401 unauthorized error", async () => {
    const user = await userFactory.makePrismaUser({
      isAdmin: false,
    })

    const accessToken = jwt.sign({
      sub: user.id.toString(),
      isAdmin: user.isAdmin,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    })

    const response = await request(app.getHttpServer())
      .post("/investments")
      .set("Authorization", `Bearer ${accessToken}`)

      .send({
        name: "Investment",
        description: "lorem ipsum",
        imageUrl: "img.jpg",
        investmentType: "bourse",
        annualProfit: 1.5,
        fundraisingProgress: {
          current: 0,
          numberOfWeeks: 2,
        },
        term: 4,
        risk: "low",
      })

    expect(response.body).toEqual({
      statusCode: 401,
      message: "Unauthorized",
    })
  })
})
