global.__rootdir__ = __dirname || process.cwd();

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { parameterValidator } from 'config/validator';
import { configDotenv } from 'dotenv';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';

configDotenv();

async function bootstrap(): Promise<void> {
  const isDev = process.env.NODE_ENV === 'dev';
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: isDev }),
  );

  const configService = app.get<ConfigService>(ConfigService);

  app.enableShutdownHooks();
  app.useGlobalPipes(parameterValidator());

  const options = new DocumentBuilder()
    .setTitle('Collaborative Code Editor Service')
    .setDescription('Collaborative Code Editor Service')
    .setVersion('1.0')
    .addTag('collaborative-code-editor-service')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  writeFileSync('./swagger.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  await app.init();
  await app.listen(
    configService.get<number>('PORT', { infer: true }) ?? 3000,
    '0.0.0.0',
  );
}

void bootstrap();
