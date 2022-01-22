const swaggerAutogen = require('swagger-autogen')()
const swaggerUi = require('swagger-ui-express');
const { version } = require('./package.json');

const swaggerDefinition = {
    info: {
        title: 'REST API Docs',
        version
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        apiKeyAuth:{
            type: "apiKey",
            in: "header",       // can be "header", "query" or "cookie"
            name: "Authorization",
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
    './server.js',
];

swaggerAutogen(outputFile, endpointsFiles, swaggerDefinition).then(() => {
    require('./server')     // Your project's root file
});
