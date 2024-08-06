import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User, UserProps } from "@/domain/entities/user"
import { PrismaUsersMapper } from "@/infra/database/prisma/mappers/prisma-user-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { fakerFR } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

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
      isAdmin: false,
      bankAccount: null, // Add this line to explicitly set bankAccount to null
      password: fakerFR.internet.password(),
      ...override,
    },
    id,
  )

  return user
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}): Promise<User> {
    const user = makeUser(data)

    await this.prisma.user.create({
      data: PrismaUsersMapper.toPrisma(user),
    })

    return user
  }
}
