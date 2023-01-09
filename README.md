# Movies Api

Movies api implementation built with NestJs and MongoDb

## Table of Contents

-   [Technologies](#technologies)
-   [Getting Started](#getting-started)
    -   [Installation](#installation)
    -   [Usage](#usage)
    -   [Testing](#testing)
    -   [Documentation](#documentation)
    -   [Deployment](#deployment)
    -   [Limitations](#limitations)

## Technologies
-   [NodeJS](https://nodejs.org/) - Runtime Environment
-   [NestJs](https://nestjs.com/) - A framework that helps build Node
-   [MongoDb](https://www.mongodb.com/) - A document database used to build highly available and scalable internet applications.
-   [Mongoose](https://mongoosejs.com/) - A Node. js-based Object Data Modeling (ODM) library for MongoDB
-   [Npm](https://www.npmjs.com/) - Dependency Manager
## Getting Started

### Installation

-   git clone
    [Movies Api](https://github.com/mikkycody/nestjs-movies-api.git)
-   Run `npm install` to install packages.
-   Docker or a local mongodb installation is required.
-   There is `docker-compose.yml` file for starting Docker, run `docker-compose up` to start the container.
-   Copy .env.example file, create a .env file if not created and edit database credentials there.
-   Run `npm run start` to run the application.


### Usage

This is the basic flow of the application.

- Register
- Login
- View all movies.
- A user can create a movie (Only a logged in user can access this protected endpoint).
- A user can update a movie (Only a logged in user can access this protected endpoint).
- A user can delete a movie (Only a logged in user can access this protected endpoint).

### Testing
-   Run `npm run test` to run the unit tests
-   Run `npm run test:e2e` to run the end to end tests (A '.env.testing' file is included in the project to connect to the in memory mongo server for tests).


### Documentation

-   Please click [here](https://documenter.getpostman.com/view/13274153/2s8Z75UAnC) to access the Postman Collection
-   Please click [here](https://nestjs-movies-crud-api.herokuapp.com/api-doc) to access the Swagger Documentation

### Deployment

This project is hosted on [heroku](https://heroku.com)

-   Please click [here](https://nestjs-movies-crud-api.herokuapp.com/) to access the hosted application
### Limitations
- Caching is not implemented
- Pagination is not implemented
