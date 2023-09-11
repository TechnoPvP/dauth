import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import morgan from 'morgan';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 5050;

  app.enableCors({
    credentials: true,
    origin: (
      requestOrigin: string,
      callback: (err: Error | null, origin?: any) => void
    ) => {
      return callback(null, requestOrigin);
    },
  });

  app.use(morgan('dev'));

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
