import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
  //# Nest
  GLOBAL_PREFIX: Joi.string().required(),
  PORT: Joi.number().required(),
  // #psql
  PAGINATION_LIMIT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
});
