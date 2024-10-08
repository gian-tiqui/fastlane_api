import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/*
 * App initializer.
 * @TODO:
 *
 * Change: Typeorm to Prisma
 * Download: argon for hashing passwords, zod for input validation
 */

async function bootstrap() {
  const PORT = process.env.PORT || 8080;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173/login',
    credentials: process.env.NODE_ENV === 'production',
  });

  await app.listen(PORT);
}
bootstrap();
