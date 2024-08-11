import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { Client, Environment } from "square"
import { SquareService } from "./square.service"
import { EnvModule } from "@/infra/env/env.module"
import { EnvService } from "@/infra/env/env.service"

@Module({
  imports: [ConfigModule, EnvModule], // Importar o EnvModule
  providers: [
    {
      provide: Client,
      useFactory: (envService: EnvService) => {
        const accessToken = envService.get("SQUARE_ACCESS_KEY")
        return new Client({
          accessToken,
          environment: Environment.Sandbox, // ou Environment.Production
        })
      },
      inject: [EnvService], // Injetar o EnvService
    },
    SquareService,
  ],
  exports: [SquareService],
})
export class SquareModule {}
