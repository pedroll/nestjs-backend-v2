export const EnvConfig = () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  globalPrefix: process.env.GLOBAL_PREFIX || 'api/v1',
  mongo: {
    dbUser: process.env.DB_User || 'Teslo',
    uri: process.env.MONGO_URI || 'mongodb://localhost',
    // port: parseInt(process.env.DB_PORT, 10) || 5432,
    dbName: process.env.DB_NAME || 'nest-pokemon',
  },
});
