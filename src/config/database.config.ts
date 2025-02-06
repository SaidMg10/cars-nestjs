import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: process.env.DB_PORT || 5432,
  dbUser: process.env.DB_USERNAME || 'postgres',
  synchronize: process.env.DATABASE_SYNC === 'true' ? true : false,
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true' ? true : false,
}));
