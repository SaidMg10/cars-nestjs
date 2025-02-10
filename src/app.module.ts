import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './logger/logger.module';
import { CarsModule } from './cars/cars.module';
import { envsSchema } from './config/envs-validations';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BrandModule } from './brands/brands.module';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
