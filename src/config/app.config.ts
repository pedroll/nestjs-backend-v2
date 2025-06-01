import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

/**
 * Configuration object for the application.
 * @returns {Object} Configuration object with environment settings.
 * @property {string} environment - The current environment (development, production, etc.).
 * @property {string} hostApi - The base URL for the API.
 * @property {number} port - The port number on which the application will run.
 * @property {string} globalPrefix - The global prefix for all API routes.
 * @property {string} apiBaseUrl - The base URL for the API with the global prefix.
 * @property {string} jwtSecret - The secret key for JWT authentication.
 * @property {string} jwtSalt - The salt for JWT authentication.
 * @property {string} passwordPattern - The regular expression pattern for validating passwords.
 * @property {Object} postgres - PostgreSQL database configuration.
 * @property {boolean} postgres.ssl - Whether to use SSL for the PostgreSQL connection.
 * @property {Object} postgres.extra - Extra SSL options for the PostgreSQL connection.
 * @property {string} postgres.dbHost - The host for the PostgreSQL database.
 * @property {string} postgres.dbUser - The username for the PostgreSQL database.
 * @property {string} postgres.dbPassword - The password for the PostgreSQL database.
 * @property {number} postgres.port - The port number for the PostgreSQL database.
 * @property {string} postgres.dbName - The name of the PostgreSQL database.
 * @property {number} postgres.paginationLimit - The default limit for pagination in the PostgreSQL database.
 * @property {boolean} postgres.syncEntities - Whether to synchronize entities with the PostgreSQL database.
 * @property {Object} mongoDb - MongoDB database configuration.
 * @property {string} mongoDb.uri - The URI for the MongoDB database.
 * @property {number} mongoDb.port - The port number for the MongoDB database.
 * @property {string} mongoDb.dbName - The name of the MongoDB database.
 * @property {string} openAiApiKey - The API key for the OpenAI service.
 * @property {string} openAiAssistantId - The assistant ID for the OpenAI service.
 */
export default (): object => ({
  /**
   * The current environment (development, production, etc.).
   * @type {string}
   */
  environment: process.env.NODE_ENV ?? 'dev',

  /**
   * The base URL for the API.
   * @type {string}
   */
  hostApi: `${process.env.HOST_API}:${process.env.PORT}`, // Ensure HOST_API and PORT are defined in your .env file

  /**
   * The port number on which the application will run.
   * @type {number}
   */
  port: parseInt(process.env.PORT ?? '3000', 10), // Default to 3000 if PORT is not defined

  /**
   * The global prefix for all API routes.
   * @type {string}
   */
  globalPrefix: process.env.GLOBAL_PREFIX ?? 'api/v1', // Default to 'api/v1' if GLOBAL_PREFIX is not defined

  /**
   * The base URL for the API with the global prefix.
   * @type {string}
   */
  apiBaseUrl: `${process.env.HOST_API}:${process.env.PORT}/${process.env.GLOBAL_PREFIX}`, // Ensure HOST_API, PORT, and GLOBAL_PREFIX are defined in your .env file

  /**
   * The secret key for JWT authentication.
   * @type {string}
   */
  jwtSecret: process.env.JWT_SECRET, // Ensure JWT_SECRET is defined in your .env file

  /**
   * The salt for JWT authentication.
   * @type {string}
   */
  jwtSalt: process.env.JWT_SALT, // Ensure JWT_SALT is defined in your .env file

  /**
   * The regular expression pattern for validating passwords.
   * @type {string}
   */
  passwordPattern: process.env.PASSWORD_PATTERN, // Ensure PASSWORD_PATTERN is defined in your .env file

  /**
   * PostgreSQL database configuration.
   * @type {Object}
   */
  postgres: {
    /**
     * Whether to use SSL for the PostgreSQL connection.
     * @type {boolean}
     */
    ssl: process.env.STAGE === 'prod',

    /**
     * Extra SSL options for the PostgreSQL connection.
     * @type {Object}
     */
    extra: {
      ssl: process.env.STAGE === 'prod' ? { rejectUnauthorized: false } : null,
    },

    /**
     * The host for the PostgreSQL database.
     * @type {string}
     */
    dbHost: process.env.DB_HOST ?? 'localhost', // Default to 'localhost' if DB_HOST is not defined

    /**
     * The username for the PostgreSQL database.
     * @type {string}
     */
    dbUser: process.env.DB_User ?? 'Teslo', // Default to 'Teslo' if DB_User is not defined

    /**
     * The password for the PostgreSQL database.
     * @type {string}
     */
    dbPassword: process.env.DB_PASSWORD ?? 'yoursecretpasword', // Default to 'yoursecretpasword' if DB_PASSWORD is not defined

    /**
     * The port number for the PostgreSQL database.
     * @type {number}
     */
    port: parseInt(process.env.DB_PORT ?? '5432', 10), // Default to 5432 if DB_PORT is not defined

    /**
     * The name of the PostgreSQL database.
     * @type {string}
     */
    dbName: process.env.DB_NAME ?? 'TesloDb', // Default to 'TesloDb' if DB_NAME is not defined

    /**
     * The default limit for pagination in the PostgreSQL database.
     * @type {number}
     */
    paginationLimit: parseInt(process.env.DB_PORT ?? '10', 10), // Corrected to read from DB_PORT, default to 10 if not defined

    /**
     * Whether to synchronize entities with the PostgreSQL database.
     * @type {boolean}
     */
    syncEntities: process.env.SYNC_ENTITIES === 'true',
  },

  /**
   * MongoDB database configuration.
   * @type {Object}
   */
  mongoDb: {
    /**
     * The URI for the MongoDB database.
     * @type {string}
     */
    uri: process.env.MONGO_URI ?? 'mongodb://localhost', // Default to 'mongodb://localhost' if MONGO_URI is not defined

    /**
     * The port number for the MongoDB database.
     * @type {number}
     */
    port: parseInt(process.env.MONGO_PORT ?? '27017', 10), // Default to 27017 if MONGO_PORT is not defined

    /**
     * The name of the MongoDB database.
     * @type {string}
     */
    dbName: process.env.MONGO_DB ?? 'TesloDb', // Default to 'TesloDb' if MONGO_DB is not defined
  },

  /**
   * The API key for the OpenAI service.
   * @type {string}
   */
  openAiApiKey: process.env.OPEN_AI_API_KEY, // Ensure OPEN_AI_API_KEY is defined in your .env file

  /**
   * The assistant ID for the OpenAI service.
   * @type {string}
   */
  openAiAssistantId: process.env.OPEN_AI_ASSISTANT_ID, // Ensure OPEN_AI_ASSISTANT_ID is defined in your .env file
});
