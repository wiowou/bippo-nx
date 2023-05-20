import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Handler } from 'aws-lambda';
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('<%= projectName %>')
    .setVersion('Dev')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document); //the /docs endpoint wont work. This enables /docs-json. Adding 'api' here enables APIGW to not require authentication by adding a direct method for this path

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({
    app: expressApp,
  });
}

export const handler: Handler = async (event, context, callback) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
