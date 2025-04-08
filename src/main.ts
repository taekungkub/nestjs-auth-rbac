import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseTransformInterceptor } from './common/interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  console.log(`🚀 NODE_ENV: ${process.env.NODE_ENV}`);
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
