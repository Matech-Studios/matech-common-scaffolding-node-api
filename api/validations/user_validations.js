const userSchemaValidation = require('./user_schema_validation');

module.exports = {
    validateUser: (req, res, next) => {
        
        const {error, value} = userSchemaValidation.validate({
            name: req.body.name,
            email: req.body.email
        });

        if(error) {
            return res.status(400).json(error);
        }
        
        next();
    },

    validateUserEmail: (req, res, next) => {
        const {error, value} = userSchemaValidation.validate({
            name: req.body.name
        });

        if(error) {
            return res.status(400).json(error);
        }
        
        next();
    }
}
