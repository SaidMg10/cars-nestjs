import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { CarsModule } from './cars/cars.module';
import { envsSchema } from './config/envs-validations';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      validationSchema: envsSchema,
    }),
    HealthModule,
    UsersModule,
    LoggerModule,
    CarsModule,
    //TODO: Add your database if you needed
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
