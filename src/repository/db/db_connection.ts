import * as config from 'config';
import * as mongoose from 'mongoose';

export default {

    connect: function() {
        mongoose.connect(config.get('configDB.mongo.host'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('Mongo DB connection successful'))
        .catch(err => console.log('Mongo DB connection error...', err));

        mongoose.set('useCreateIndex', true);
        mongoose.set('useFindAndModify', false);
    },
};