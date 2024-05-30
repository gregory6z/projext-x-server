export class FundraisingProgress {
  private createdAt: Date
  private numberOfWeeks: number

  private constructor(createdAt: Date, numberOfWeeks: number) {
    this.createdAt = createdAt
    this.numberOfWeeks = numberOfWeeks
  }

  static create(createdAt: Date, numberOfWeeks: number) {
    return new FundraisingProgress(createdAt, numberOfWeeks)
  }

  calculate(): number {
    const now = new Date()
    const millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7 // 1 week in milliseconds
    const weeksSinceCreation =
      (now.getTime() - this.createdAt.getTime()) / millisecondsPerWeek

    let progress: number

    if (weeksSinceCreation >= this.numberOfWeeks) {
      progress = 100
    } else {
      progress = (weeksSinceCreation / this.numberOfWeeks) * 100
    }

    return progress
  }
}
