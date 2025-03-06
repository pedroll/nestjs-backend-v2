export const EnvConfig = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api/v1',
  postgres: {
    dbHost: process.env.DB_HOST || 'localhost',
    dbUser: process.env.DB_User || 'Teslo',
    dbPassword: process.env.DB_PASSWORD || 'yoursecretpasword',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    dbName: process.env.DB_NAME || 'TesloDb',
    paginationLimit: +process.env.PAGINATION_LIMIT! || 10,
    syncEntities: process.env.SYNC_ENTITIES === 'true', //
  },
});
