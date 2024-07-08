import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configurations from "./config/configurations";
import { HealthModule } from "./service/health/health.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      envFilePath: [`.env`],
    }),
    HealthModule,
  ],
})
export class ChattingServerModule {}
