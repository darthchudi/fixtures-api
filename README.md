# Fixtures API

RESTful API endpoints for managing Fixtures in Mock Premier League

[![CircleCI](https://circleci.com/gh/darthchudi/fixtures-api.svg?style=svg)](https://circleci.com/gh/darthchudi/fixtures-api)

## Documentation

The postman collection can be found here:
The accompanying documentation for the postman collection can be found here:

## How to run locally

1. Clone the repo
2. Download Dependencies: `npm install` or `yarn install`
3. Build Typescript source: `npm run build:tsc` or `yarn build:tsc`
4. Ensure MongoDB is installed locally on your machien and an enviroment variable named `MONGODB_URL` exists and points to a valid MongoDB url
5. Start the Server: `npm run start` or `yarn start`
6. Run tests (optional): `npm run test` or `yarn test`

## Tests

Tests for the User, Team and Fixture entities can be found in the `src/data/repositories/fixture` directory, where they are implemented on the data access layer.

## Stack

- Node.js + Typescript - Backend
- MongoDB - Database
- Testing - Jest
- Continuous Integration - CircleCI
- Cloud Provider - Heroku
