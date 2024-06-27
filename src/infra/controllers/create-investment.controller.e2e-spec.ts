import { AppModule } from "@/infra/app.module"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"

describe("Create Investment (E2E)", () => {
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

  test("[POST] /investments", async () => {
    const response = await request(app.getHttpServer())
      .post("/investments")
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
    const response = await request(app.getHttpServer())
      .post("/investments")
      .send({
        email: "not-an-email",
      })

    expect(response.statusCode).toBe(400)
  })
})
