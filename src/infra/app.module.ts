import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { envSchema } from "./env/env"
import { EnvModule } from "./env/env.module"
import { HttpModule } from "./http/http.module"
import { SeedModule } from "./database/prisma/seeds/seed.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HttpModule,
    SeedModule,
    // StripeNestModule,
  ],
  controllers: [],
})
export class AppModule {}
