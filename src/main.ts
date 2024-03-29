import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'log'],
    rawBody: true,
  });
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Literasiin')
    .setDescription('Literasiin API documentation')
    .setVersion('1.0')
    .addTag('users')
    .addTag('stories')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipUndefinedProperties: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({ origin: '*', credentials: true });
  // app.useWebSocketAdapter(new WsAdapter(app));
  // initializeApp();
  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
