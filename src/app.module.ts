import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';

import { envsSchema } from './config/envs-validations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BrandModule } from './brands/brands.module';
import { CarTypesModule } from './car-types/car-types.module';
import { FilesModule } from './files/files.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataResponseInterceptor } from './common/interceptors/data-response.interceptor';
import { CarsModule } from './cars/cars.module';
import { CommonModule } from './common/common.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validationSchema: envsSchema,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
    }),
    HealthModule,
    CommonModule,
    UsersModule,
    LoggerModule,
    CarsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: configService.get('database.autoLoadEntities'),
        synchronize: configService.get('database.synchronize'),
        host: configService.get('database.dbHost'),
        port: +configService.get('database.dbPort'),
        username: configService.get('database.dbUser'),
        password: configService.get('database.dbPassword'),
        database: configService.get('database.dbName'),
      }),
      dataSourceFactory: async (options) => {
        if (!options) {
          throw new Error('DataSourceOptions is undefined');
        }
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    BrandModule,
    CarTypesModule,
    FilesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataResponseInterceptor,
    },
  ],
})
export class AppModule {}
