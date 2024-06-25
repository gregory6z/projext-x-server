import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User } from "@/domain/entities/user"
import { User as PrismaUser, Prisma } from "@prisma/client"

export class PrismaServicesMapper {
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
      birthDate: user.birthDate,
      email: user.email,
      phone: user.phone,
      password: user.password,
    }
  }
}
