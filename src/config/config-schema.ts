import Joi from 'joi';

export const configSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'development'),
  PORT: Joi.number().required().default(3000),
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
  GITHUB_URL: Joi.string().required(),
  GITHUB_REDIRECT_URI: Joi.string().required(),
  GITHUB_FETCH_USER_DETAILS_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  DB_TYPE: Joi.string().valid(
    'postgres',
    'mysql',
    'mariadb',
    'sqlite',
    'oracle',
    'mssql',
  ),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SCHEMA: Joi.string().required(),
  DB_RETRY_ATTEMPTS: Joi.number().default(10),
  DB_RETRY_DELAY: Joi.number().default(3000),
  SMTP_EMAIL: Joi.string().email().required(),
  SMTP_PASS: Joi.string().required(),
});
