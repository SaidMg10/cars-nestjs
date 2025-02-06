import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      //TODO: Add your validationSchema Example: joi or ZOD
    }),
    HealthModule,
    UsersModule,
    LoggerModule,
    //TODO: Add your database if you needed
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
