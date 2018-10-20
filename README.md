# Fixtures API

RESTful API endpoints for managing Fixtures in Mock Premier League

[![CircleCI](https://circleci.com/gh/darthchudi/fixtures-api.svg?style=svg)](https://circleci.com/gh/darthchudi/fixtures-api)

[API Link](https://fixtures-api.herokuapp.com/api))

## Note

All relevant API endpoints are prefixed with `/api`

## Documentation

The documentation was built with Postman and be found here: [Documentation](https://documenter.getpostman.com/view/3903733/RWguwwKy)

## How to run locally

1. Clone the repo
2. Download Dependencies: `npm install` or `yarn install`
3. Build Typescript source: `npm run build:tsc` or `yarn build:tsc`
4. Ensure MongoDB is installed locally on your machien and an enviroment variable named `MONGODB_URL` exists and points to a valid MongoDB url
5. Start the Server: `npm run start` or `yarn start`
6. Run tests (optional): `npm run test` or `yarn test`

## Tests

There are 4 test suites and 23 tests in total. Tests for the User, Team and Fixture entities can be found in the `src/data/repositories/fixture` directory, where they are implemented on the data access layer.

## Stack

- Backend - Node.js + Typescript
- Database - MongoDB
- Testing - Jest
- Continuous Integration - CircleCI
- Cloud Provider - Heroku
