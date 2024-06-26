import { ExternalBanksRepository } from "@/domain/repositories/external-banks-repository"
import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { ExternalBank } from "@/domain/entities/external-bank"
import { PrismaExternalBanksMapper } from "../mappers/prisma-external-bank-mapper"

@Injectable()
export class PrismaExternalBanksRepository implements ExternalBanksRepository {
  constructor(private prisma: PrismaService) {}

  async create(externalBank: ExternalBank): Promise<void> {
    const data = PrismaExternalBanksMapper.toPrisma(externalBank)

    await this.prisma.externalBank.create({
      data,
    })
  }

  async update(externalBank: ExternalBank): Promise<void> {
    const data = PrismaExternalBanksMapper.toPrisma(externalBank)
    await this.prisma.externalBank.update({
      where: {
        id: externalBank.id.toString(),
      },
      data,
    })
  }

  async findById(id: string): Promise<ExternalBank | null> {
    const externalBank = await this.prisma.externalBank.findUnique({
      where: {
        id,
      },
    })

    if (!externalBank) {
      return null
    }

    return PrismaExternalBanksMapper.toDomain(externalBank)
  }

  async delete(externalBank: ExternalBank): Promise<void> {
    await this.prisma.externalBank.delete({
      where: {
        id: externalBank.id.toString(),
      },
    })
  }
}
