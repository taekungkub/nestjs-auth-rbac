# 🔥🔥 Nest.js Auth + Rbac + PostgreSQL + TypeORM + Swagger 🔥🔥


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


## Features

- Authentication using [Passport](https://www.passportjs.org/)
- [Local](https://www.passportjs.org/packages/passport-local/) and [JWT](https://www.passportjs.org/packages/passport-local/) strategies are implemented
- [TypeORM](https://typeorm.io/) to connect with PostgreSQL
- CRUD User, Role , Permission
- Notification with sse
- Api document with swagger
- Run the necessary services with [docker compose](https://docs.docker.com/compose/)


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

```
NODE_ENV=development
JWT_SECRET=
JWT_EXPIRES_IN=
REFRESH_JWT_SECRET=
REFRESH_JWT_EXPIRES_IN=
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

You can copy the example `.env` and edit the values

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Tech Stack

**Server:** Typescript, PostgreSQL, Nest.js, TypeORM, Passport

**Test:** Jest, SuperTest, TS auto mock

**DevOps:** Docker Compose

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.