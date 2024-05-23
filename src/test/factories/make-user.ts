import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User, UserProps } from "@/domain/entities/user"
import { fakerFR } from "@faker-js/faker"

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityID,
) {
  const user = User.create(
    {
      firstName: fakerFR.person.firstName(),
      lastName: fakerFR.person.lastName(),
      email: fakerFR.internet.email(),
      phone: fakerFR.phone.number(),
      birthDate: fakerFR.date.past(),
      address: fakerFR.location.streetAddress(),
      investments: null,
      account: null,
      password: fakerFR.internet.password(),
      ...override,
    },
    id,
  )

  return user
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
