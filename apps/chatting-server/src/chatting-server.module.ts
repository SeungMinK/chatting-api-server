import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import configurations from "./config/configurations";
import { HealthModule } from "./service/health/health.module";
import { UserModule } from "./service/user/user.module";
import { AuthModule } from "./service/auth/auth.module";
import { UserEntity } from "./entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("database.host"),
        port: +configService.get<number>("database.port"),
        username: configService.get("database.user"),
        password: configService.get("database.password"),
        database: configService.get("database.name"),
        extra: {
          idleTimeout: configService.get("database.config.idleTimeout"), // 7210 sec
          connectionLimit: configService.get("database.config.connectionLimit"),
          maxIdle: configService.get("database.config.maxIdle"),
        },
        replication: {
          master: {
            host: configService.get("database.host"),
            port: +configService.get<number>("database.port"),
            username: configService.get("database.user"),
            password: configService.get("database.password"),
            database: configService.get("database.name"),
          },
          slaves: [
            {
              host: configService.get("database.slave.host"),
              port: +configService.get<number>("database.slave.port"),
              username: configService.get("database.slave.user"),
              password: configService.get("database.slave.password"),
              database: configService.get("database.slave.name"),
            },
          ],
          canRetry: true,
        },
        entities: [UserEntity],
        timezone: configService.get("database.timezone"),
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    HealthModule,
    AuthModule,
    UserModule,
  ],
})
export class ChattingServerModule {}
