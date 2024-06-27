import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Create Account (E2E)", () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test("[POST] /accounts", async () => {
    const response = await request(app.getHttpServer())
      .post("/accounts")
      .send({
        email: "due@test.com",
        password: "12345",
        firstName: "John",
        address: "1234 Main St",
        birthDate: new Date(1993, 3, 26),
        lastName: "Doe",
        phone: "1234567890",
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: "due@test.com",
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
  it("should return 400 for invalid data", async () => {
    const response = await request(app.getHttpServer()).post("/accounts").send({
      email: "not-an-email",
    })

    expect(response.statusCode).toBe(400)
  })
  it("should return 409 for user already exists error", async () => {
    const response = await request(app.getHttpServer())
      .post("/accounts")
      .send({
        email: "due@test.com",
        password: "12345",
        firstName: "John",
        address: "1234 Main St",
        birthDate: new Date(1993, 3, 26),
        lastName: "Doe",
        phone: "1234567890",
      })

    expect(response.statusCode).toBe(409)
    expect(response.body.message).toContain(
      `User "due@test.com" already exists`,
    )
  })
})
