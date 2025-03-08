global.__rootdir__ = __dirname || process.cwd();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { configDotenv } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { parameterValidator } from 'config/validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

configDotenv();

async function bootstrap() {
  const isDev = process.env.NODE_ENV === 'dev';
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: isDev }),
  );

  app.useGlobalPipes(parameterValidator());

  const options = new DocumentBuilder()
    .setTitle('Collaborative Code Editor Service')
    .setDescription('Collaborative Code Editor Service')
    .setVersion('1.0')
    .addTag('collaborative-code-editor-service')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.enableCors();
  await app.init();
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
