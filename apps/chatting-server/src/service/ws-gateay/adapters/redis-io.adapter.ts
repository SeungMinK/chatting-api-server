import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(app: INestApplication): Promise<void> {
    const configService = app.get(ConfigService);
    const redisHost = configService.get("redis.host");
    const redisPort = configService.get("redis.port");

    const pubClient = createClient({
      url: `redis://${redisHost}:${redisPort}`,
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClient, subClient);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
