import * as express from 'express';
import users from './api/controllers/users';
import auth from './api/controllers/auth';
import db from './repository/db/db_connection';
import customErrorsResponse from './api/utils/custom_errors_response';
import * as swaggerUi from 'swagger-ui-express';
const swaggerFile = require('./swagger_output.json');

db.connect();

const app: express.Application = express();

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
