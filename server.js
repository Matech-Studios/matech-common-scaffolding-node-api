const express = require('express');
// const users = require('./routes/users');
// const auth = require('./routes/auth');
const db = require('./db/db_connection');

db.connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

/* Routes Setup */

// app.use('/api/users', users);
// app.use('/api/auth', auth);

app.use('/', (req, res) => {
    res.json('API setup correctly! You can remove this route now.')
});

/* End Routes */

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('API REST up & running');
});
