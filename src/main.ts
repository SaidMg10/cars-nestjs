import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //TODO: app.setGlobalPrefix(''); Add a prefix if you want
  //TODO: app.useGlobalPipes(); Add global pipes if you want
  const configService = app.get(ConfigService);
  const port = configService.get<string>('PORT', '3000');
  // TODO: app.enableCors(); Add CORS support if you want

  await app.listen(port, '0.0.0.0');

  const logger = app.get(Logger);
  logger.log(`App is ready and listening on port ${port} 🚀`);
}
bootstrap().catch((err) => {
  console.error('Error starting the app:', err);
});
