import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  console.log(`🚀 NODE_ENV: ${process.env.NODE_ENV}`);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
