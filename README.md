# nodejs-api-rest-with-mongo-db

## Node version

> 8.17.0

`We should update this to a newer version.`

## Pre-requisites

> Docker (not mandatory)

This is for local DB only, unless you connect to an external server.

## Quickly spin up a Mongo DB server

```
docker run -d -p 27017:27017 --name mongodb mongo:5.0.4
```

For PRD, configure `production.json` accordingly.

## Local build & run

```
npm install
npm start
```

Open a browser or Postman: http://localhost:3000/api/v1/users