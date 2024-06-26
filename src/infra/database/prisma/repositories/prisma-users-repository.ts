import { User } from "@/domain/entities/user"
import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { UsersRepository } from "@/domain/repositories/users-repository"
import { PrismaUsersMapper } from "../mappers/prisma-user-mapper"

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }

  async create(user: User): Promise<void> {
    const data = PrismaUsersMapper.toPrisma(user)

    await this.prisma.user.create({
      data,
    })
  }

  async update(user: User): Promise<void> {
    const data = PrismaUsersMapper.toPrisma(user)
    await this.prisma.user.update({
      where: {
        id: user.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!user) {
      return null
    }

    return PrismaUsersMapper.toDomain(user)
  }
}
