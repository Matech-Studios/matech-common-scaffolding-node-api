const swaggerAutogen = require('swagger-autogen')();
import { version } from '../package.json';

const swaggerDefinition = {
    info: {
        title: 'REST API Docs',
        version,
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        apiKeyAuth: {
            type: "apiKey",
            in: "header",       // can be "header", "query" or "cookie"
            name: "Authorization",
        }
    }
};

const outputFile = './dist/src/swagger_output.json';
const endpointsFiles = [
    './dist/src/server.js',
];

swaggerAutogen(outputFile, endpointsFiles, swaggerDefinition)
    .then(async () => {
        await import('./server')     // Your project's root file
    });
