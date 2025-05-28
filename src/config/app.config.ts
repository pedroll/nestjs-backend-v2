import * as dotenv from 'dotenv';

dotenv.config(); // npm run start:dev --env-file .rnv

export default () => ({
  environment: process.env.NODE_ENV ?? 'dev',
  hostApi: `${process.env.HOST_API}:${process.env.PORT}`,
  port: parseInt(process.env.PORT ?? '3000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX ?? 'api/v1',
  apiBaseUrl: `${process.env.HOST_API}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}`,
  jwtSecret: process.env.JWT_SECRET,
  jwtSalt: process.env.JWT_SALT,
  passwordPattern: process.env.PASSWORD_PATTERN,
  postgres: {
    ssl: process.env.STAGE === 'prod',
    extra: {
      ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
    },
    dbHost: process.env.DB_HOST ?? 'localhost',
    dbUser: process.env.DB_User ?? 'Teslo',
    dbPassword: process.env.DB_PASSWORD ?? 'yoursecretpasword',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    dbName: process.env.DB_NAME ?? 'TesloDb',
    paginationLimit: parseInt(process.env.DB_PORT ?? '10', 10),
    syncEntities: process.env.SYNC_ENTITIES === 'true', //
  },
  mongoDb: {
    uri: process.env.MONGO_URI ?? 'mongodb://localhost',
    port: parseInt(process.env.MONGO_PORT ?? '27017', 10),
    dbName: process.env.MONGO_DB ?? 'TesloDb',
  },
});
