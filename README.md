<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

Skeleton NestJs Backend
===============
## Description

Mockup bakend NestJs based on udemy course
Postgres version to be expanded with other features

* [x] Restful
* [x] Postgres
* [x] TypeOrm PG
* [x] Serve static files front
* [x] Mongo
* [x] Mongo Mongoose
* [x] Seed initial data
* [x] Authentication
* [x] Authorization
* [x] JWT
* [x] Swagger documentation http://localhost:3000/api
* [x] Websockets

Caracteristicas no incluidas en el curso:

* [x] Eslint Rules NestJs Jest
* [x] Unit tests COV 72% - using various styles for document
* [ ] e2e tests
* [ ] Graphql
* [ ] Typed responses
* [ ] Shared library with responses para monorepo
* [ ] Monorepo con Frontend
* [ ] Http adapter, para cómodo reemplazo de requests o actualizaciones de librerias http
* [ ] dockerized
## 1- Project setup
```bash
$ yarn install
```

## 2- Deploy docker DB
```bash
docker compose up
```

## 3- Environment variables
Clone __.env.template__ to __.env__ and set the values

## 3- Compile and run the project

# serve
```bash
yarn start
```
# watch mode

```bash
yarn start:dev
```

# production mode

```bash
yarn start:prod
```

## 4- Seed data for development

    ### GET Populate Seed data
    GET {{ apiUrl }}/seed
______________________
## 5- Production Build
______________________
* Crear archivo .env.prod con las variables de entorno de producción
* Crear imagen
```bash
docker compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

## 6- Production Run
```bash
docker compose -f docker-compose.prod.yaml --env-file .env.prod up
```

Por defecto, __docker-compose__ usa el archivo ```.env```, por lo que si tienen el archivo .env y lo configuran con sus variables de entorno de producción, bastaría con
```bash
docker compose -f docker-compose.prod.yaml up --build
```