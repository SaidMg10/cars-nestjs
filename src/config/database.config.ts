const {
  DB_PASSWORD: dbPassword,
  DB_NAME: dbName,
  DB_HOST: dbHost,
  DB_PORT: dbPort,
  DB_USERNAME: dbUser,
} = process.env;

export const DbConfiguration = () => ({
  dbPassword,
  dbName,
  dbHost,
  dbPort,
  dbUser,
});
