import { NestFactory } from "@nestjs/core";
import { ChattingServerModule } from "./chatting-server.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { json, urlencoded } from "express";

async function bootstrap() {
  const app = await NestFactory.create(ChattingServerModule);
  const port = process.env.CHATTING_SERVER_PORT ?? 3000;

  app.use(json({ limit: "1mb" }));
  app.use(urlencoded({ extended: true, limit: "1mb" }));

  app.enableCors({
    origin: "*",
  });

  const config = new DocumentBuilder()
    .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }) // Add this line
    .setTitle("API Server")
    .setDescription("The Chatting API description")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  // app.useGlobalFilters(new AllExceptionsFilter())

  await app.listen(3000);

  console.info(
    `[${process.env.NODE_ENV}] Chatting-Server Service is listening (Port : ${port}), PID: ${process.pid}`,
  );
}

bootstrap();
