import { NestFactory } from "@nestjs/core";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { AppModule } from "./app.module";
import type { Request } from "express";

// Estender tipagem do Express para incluir rawBody
declare global {
  namespace Express {
    interface Request {
      rawBody?: string;
    }
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use((req, res, next) => {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk.toString();
    });
    req.on("end", () => {
      req.rawBody = rawBody;
      try {
        req.body = JSON.parse(rawBody);
      } catch {
        req.body = {};
      }
      next();
    });
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
