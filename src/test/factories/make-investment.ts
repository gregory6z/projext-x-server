import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Investment, InvestmentProps } from "@/domain/entities/investment"
import { fakerFR } from "@faker-js/faker"

export function makeInvestment(
  override: Partial<InvestmentProps> = {},
  id?: UniqueEntityID,
) {
  const investment = Investment.create(
    {
      name: fakerFR.lorem.words(2),
      description: fakerFR.lorem.words(10),
      imageUrl: fakerFR.image.url(),

      status: "pending",
      investmentType: fakerFR.lorem.word(),
      annualProfit: 10,
      fundraisingProgress: {
        current: 1,
        numberOfWeeks: 2,
      },
      monthlyProfits: [],
      term: 1,
      risk: "low",
      startDate: new Date(),
      endDate: null,
      createdAt: new Date(),
      updatedAt: null,
      ...override,
    },
    id,
  )

  return investment
}
