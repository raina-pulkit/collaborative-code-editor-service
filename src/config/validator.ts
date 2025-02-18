import { ValidationPipe } from '@nestjs/common';

export const parameterValidator = (): ValidationPipe => {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
}
