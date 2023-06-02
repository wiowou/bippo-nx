import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

let _app;

async function bootstrap() {
  if (!_app) {
    _app = await NestFactory.createApplicationContext(AppModule);
  }
  return _app;
}

export const handler = async (event) => {
  console.log(event);
  const app = await bootstrap();
  const service = app.get(AppService);

  const message = await service.getData();

  return {
    body: JSON.stringify({
      message,
    }),
  };
};
