export const EnvConfig = () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX ?? 'api/v1',
  postgres: {
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
