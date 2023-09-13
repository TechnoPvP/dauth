import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { readFileSync } from 'fs';
import path from 'path';

const httpsOptions = {
  key: readFileSync(path.join('/Users/adam/code/Cert/', 'localhost-key.pem')),
  cert: readFileSync(path.join('/Users/adam/code/Cert/', 'localhost.pem')),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
  });
  const port = 6010;

  app.enableCors({
    credentials: true,
    origin: (
      requestOrigin: string,
      callback: (err: Error | null, origin?: any) => void
    ) => {
      return callback(null, requestOrigin);
    },
  });

  await app.listen(port);

  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
