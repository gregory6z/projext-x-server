import { AppModule } from "@/infra/app.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { InvestmentFactory } from "test/factories/make-investment"
import { DatabaseModule } from "../database/database.module"

describe("Fetch Investment (E2E)", () => {
  let app: INestApplication
  let investmentFactory: InvestmentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [InvestmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    investmentFactory = moduleRef.get(InvestmentFactory)

    await app.init()
  })

  test("[GET] /investments", async () => {
    const expectedInvestment = await investmentFactory.makePrismaInvestment()

    const response = await request(app.getHttpServer())
      .get("/investments")
      .send()

    console.log(response.body)

    expect(response.statusCode).toBe(200)
    expect(
      response.body.investments.some(
        (investment: { id: string }) =>
          investment.id === expectedInvestment.id.toString(),
      ),
    ).toBe(true)
  })
})
