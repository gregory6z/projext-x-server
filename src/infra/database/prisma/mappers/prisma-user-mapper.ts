import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User } from "@/domain/entities/user"
import { User as PrismaUser, Prisma } from "@prisma/client"

export class PrismaUsersMapper {
  static toDomain(raw: PrismaUser): User {
    return User.create(
      {
        firstName: raw.firstName,
        lastName: raw.lastName,
        address: raw.address,
        isAdmin: raw.isAdmin,
        birthDate: raw.birthDate,
        email: raw.email,
        phone: raw.phone,
        password: raw.password,
        accountNumber: raw.accountNumber,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(user: User): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address,
      isAdmin: user.isAdmin,
      accountNumber: user.accountNumber,
      birthDate: user.birthDate,
      email: user.email,
      phone: user.phone,
      password: user.password,
    }
  }
}
