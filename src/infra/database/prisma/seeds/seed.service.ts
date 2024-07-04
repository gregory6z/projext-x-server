// src/seed/seed.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { User } from "@/domain/entities/user"
import { HashGenerator } from "@/core/cryptography/hash-generator"

@Injectable()
export class SeedService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private prisma: PrismaService,
    private hashGenerator: HashGenerator,
  ) {}

  async onModuleInit() {
    try {
      const newUser = User.create({
        firstName: "Gregory",
        lastName: "Praxedes",
        address: "134 rue avenue",
        isAdmin: true,
        birthDate: new Date(1993, 3, 26),
        email: "gregoryteste@teste.com",
        phone: "12345678",
        password: "1234",
        accountNumber: null,
      })

      // Verifica se já existe um usuário com o mesmo e-mail
      const existingUser = await this.prisma.user.findUnique({
        where: {
          email: newUser.email,
        },
      })

      if (!existingUser) {
        // Se não existir, cria o novo usuário

        const hashedPassword = await this.hashGenerator.hash(newUser.password)

        await this.prisma.user.create({
          data: {
            id: newUser.id.toString(),
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            address: newUser.address,
            isAdmin: newUser.isAdmin,
            birthDate: newUser.birthDate,
            email: newUser.email,
            phone: newUser.phone,
            password: hashedPassword,
            accountNumber: newUser.accountNumber,
          },
        })
        console.log("Usuário criado com sucesso.")
      } else {
        console.log("Usuário com o mesmo e-mail já existe.")
      }
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
    }
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect()
  }
}
