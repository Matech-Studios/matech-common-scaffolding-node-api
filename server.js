const express = require('express');
const users = require('./api/controllers/users');
const auth = require('./api/controllers/auth');
const db = require('./repository/db/db_connection');
const customErrorsResponse = require('./api/utils/custom-errors-response');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

db.connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

/* Routes Setup */

app.use('/api/v1/users', users);
app.use('/api/v1/auth', auth);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

/* End Routes */

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('API REST up & running');

    customErrorsResponse(app);
});
