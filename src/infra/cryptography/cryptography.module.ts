import { Encrypter } from "@/core/cryptography/encrypter"
import { Module } from "@nestjs/common"
import { JwtEncrypter } from "./jwt-encrypter"
import { HashComparer } from "@/core/cryptography/hash-comparer"
import { BcryptHasher } from "./bcrypt-hasher"
import { HashGenerator } from "@/core/cryptography/hash-generator"

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
