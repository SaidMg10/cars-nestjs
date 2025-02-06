<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

<p align="center">
  Personal Template for Building Projects with My Team, Based on NestJS Best Practices
</p>

## Project Overview

This template was created to streamline the development of projects with my team, making it easier and more comfortable to kick-start new services. It is based on a [NestJS](https://github.com/AlbertHernandez/nestjs-service-template) template and modified to fit our specific needs. It includes essential tools like Docker, ESLint, Husky for linting, and a flexible directory structure for rapid development.

This template was inspired by the work of [Albert Hernandez](https://www.youtube.com/watch?v=l--D8yslyUk), whose video and repository helped guide the creation of this project. Modifications include using Express, adding Yarn as a package manager, and making adjustments to the database configuration for personal convenience and flexibility.

## Credits

This project is based on the work of [Albert Hernandez](https://github.com/AlbertHernandez). The original template was modified to use Express, added Yarn as a package manager, and adjusted configurations for the database. All credit goes to the original creator.

## Prerequisites

Before starting, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Recommended version: LTS)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)

## Project setup

```bash
$ yarn install
```

## Env Configuration

1. Clone the `.env.template` file and rename it according to the environment:

- For development: `.env.development`
- For production: `.env.production`
- For testing: `.env.test`
- Or use a general: `.env`

2. Fill in the file with the corresponding values for each environment

3. Make sure not to commit `.env` files to the repository (they should be included in `.gitignore`)

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Compile and Run the Project with Docker

- For the initial creation, we will always use the `--build` command, for example: `docker-compose up --build` or `docker-compose build`.
- For detached mode, we will add the `-d` flag at the end of the command, for example: `docker-compose up --build -d`.
- If the `--build` has already been done, to start the project, we only need to use `docker-compose up`.
- If we want to remove everything, we will use `docker-compose down`.

### Running the Backend and Database

You can run the project with or without the database depending on your needs:

- **To run only the backend** (without the database):

  ```bash
  docker-compose up backend-dev
  ```

- **To run the database** (without the backend) add the `--profile db` flag:

  ```bash
  docker compose --profile db up template_db
  ```

- **To run everything together** (both backend and database):

  ```bash
  docker compose up backend-dev template_db
  ```

- **To run everything** (without profiles)
  ```bash
  docker-compose up
  ```

## Select the Development Environment

To choose the environment in which the application will run, use the following commands:

```bash
# Development Mode
$ NODE_ENV=development docker-compose up

# Production Mode
$ NODE_ENV=production docker-compose up

# Test Mode
$ NODE_ENV=test docker-compose up
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

This development mode will work with hot-reload and expose a debug port, port 9229, so later we can connect to it from our editor.

Now, you should be able to start debugging configuring using your IDE. For example, if you are using vscode, you can create a .vscode/launch.json file with the following configuration:

```
{
  "version": "0.1.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to docker",
      "restart": true,
      "port": 9229,
      "remoteRoot": "/app"
    }
  ]
}
```
