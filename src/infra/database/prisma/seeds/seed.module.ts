import { Module } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { SeedService } from "./seed.service"
import { HashGenerator } from "@/core/cryptography/hash-generator"
import { BcryptHasher } from "@/infra/cryptography/bcrypt-hasher"

@Module({
  providers: [
    SeedService,
    PrismaService,
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
})
export class SeedModule {}
