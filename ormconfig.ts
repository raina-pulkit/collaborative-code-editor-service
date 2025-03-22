import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configDotenv } from 'dotenv';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

configDotenv();

const isDev = process.env.NODE_ENV === 'development';

export const options: TypeOrmModuleOptions = {
  type: 'postgres',
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/src/modules/**/entities/*{.ts,.js}'],
  migrations: ['dist/src/migrations/**/*{.ts,.js}'],
  retryAttempts: 10,
  retryDelay: 3000,
  synchronize: isDev,
  logging: isDev,
  autoLoadEntities: true,
  database: 'postgres',
};

export const getTypeormOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  ...options,
  host: configService.get<string>('DB_HOST', { infer: true }),
  port: +configService.get<string>('DB_PORT', { infer: true }),
  username: configService.get<string>('DB_USER', { infer: true }),
  password: configService.get<string>('DB_PASSWORD', { infer: true }),
  schema: configService.get<string>('DB_SCHEMA', { infer: true }),
});

const migrationOptions: TypeOrmModuleOptions = {
  ...options,
};

const connectionSource = new DataSource({
  ...migrationOptions,
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  schema: process.env.DB_SCHEMA,
  database: 'postgres',
});

export default connectionSource;
