const express = require('express');
const routes = express.Router();
const verifyToken = require('../middlewares/auth');
const userSchemaValidation = require('../validations/user_schema_validation');
const userService = require('../../service/user_service');

routes.get('/', async (req, res) => {
    
    let result = userService.listActiveUsers();

    result
        .then(users => {
            return res.json(users);
        })
        .catch(err => {
            return res.status(400).json({
                error: err
            });
        });
});

routes.post('/', async (req, res) => {
    let body = req.body;

    const user = await userService.findByEmail(body.email);
    
    if(user) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    // this validation could be moved to a middleware
    const {error, value} = userSchemaValidation.validate({
        name: body.name,
        email: body.email
    });

    if(!error) {
        let result = userService.createUser(body);

        result
            .then(user => {
                res.status(201).json({
                    name: user.name,
                    email: user.email
                });
            })
            .catch(err => {
                res.status(400).json({ err });
            });
    } else {
        res.status(400).json({
            error
        })
    }
});

routes.put('/:email', verifyToken, async (req, res) => {
    
    // this validation could be moved to a middleware
    const {error, value} = userSchemaValidation.validate({
        name: req.body.name
    });

    if(!error) {
        let result = userService.updateUser(req.params.email, req.body);

        result
            .then(user => {
                res.json({
                    name: user.name,
                    email: user.email
                })
            })
            .catch(err => {
                res.status(400).json({
                    err
                })
            });
    } else {
        res.status(400).json({
            error
        })
    }    
});

routes.delete('/:email', async (req, res) => {
    let result = userService.deactivateUser(req.params.email);

    result
        .then(user => {
            return res.json({
                name: user.name,
                email: user.email
            })
        })
        .catch(err => {
            res.status(400).json({
                err
            })
        });
});

module.exports = routes;