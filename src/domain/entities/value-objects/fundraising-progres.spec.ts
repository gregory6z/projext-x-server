import { FundraisingProgress } from "./fundraising-progress"

describe("FundraisingProgress", () => {
  it("should calculate progress correctly when weeksSinceCreation is less than numberOfWeeks", () => {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - 7) // 1 week ago

    const fundraisingProgress = FundraisingProgress.create(createdAt, 2)
    const progress = fundraisingProgress.calculate()

    expect(Math.round(progress)).toEqual(50)
  })

  it("should calculate progress as 100 when weeksSinceCreation is greater than numberOfWeeks", () => {
    const createdAt = new Date()
    createdAt.setDate(createdAt.getDate() - 21) // 3 weeks ago

    const fundraisingProgress = FundraisingProgress.create(createdAt, 2)
    const progress = fundraisingProgress.calculate()

    expect(progress).toEqual(100)
  })

  it("should calculate progress as 0 when weeksSinceCreation is less than 1 week", () => {
    const createdAt = new Date() // now

    const fundraisingProgress = FundraisingProgress.create(createdAt, 2)
    const progress = fundraisingProgress.calculate()

    expect(progress).toEqual(0)
  })
})
