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
* [ ] Mongo
* [ ] Mongo Mongoose
* [ ] Seed initial data from external Api
* [ ] Http adapter, para cómodo reemplazo de requests o actualizaciones de librerias http
* [ ] Websockets
* [ ] Authentication
* [ ] Authorization
* [ ] dockerized

Caracteristicas no incluidas en el curso:
* [ ] Handle multiple databases
* [ ] Graphql
* [ ] Microservices
* [ ] Doble Auth JWT / OAUTH
* [ ] Typed responses
* [ ] Tests
* [ ] Shared library with responses para monorepo
* [ ] Monorepo con Frontend

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

```bash

## 3- Compile and run the project
```bash
# serve
yarn start

# watch mode
yarn start:dev

# production mode
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