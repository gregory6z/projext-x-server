import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  InvestmentPurchase,
  InvestmentPurchaseProps,
} from "@/domain/entities/investiment-purchase"

export function makeInvestmentPurchase(
  override: Partial<InvestmentPurchaseProps> = {},
  id?: UniqueEntityID,
) {
  const investmentPurchase = InvestmentPurchase.create(
    {
      accountId: "1",
      investmentId: "1",
      initialAmount: 100,
      status: "completed",
      paymentType: "normal",
      ...override,
    },
    id,
  )

  return investmentPurchase
}

// @Injectable()
// export class StudentFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
//     const student = makeStudent(data)

//     await this.prisma.user.create({
//       data: PrismaStudentMapper.toPrisma(student),
//     })

//     return student
//   }
// }
