const express = require('express');
const routes = express.Router();
const verifyToken = require('../middlewares/auth');
const userValidations = require('../validations/user_validations');
const userService = require('../../service/user_service');

routes.get('/', async (req, res) => {
    
    try {
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

    } catch(e) {
        next(e);
    }
});

routes.post('/', userValidations.validateUser, async (req, res) => {
    
    try {
        let body = req.body;

        const user = await userService.findByEmail(body.email);
        
        if(user) {
            return res.status(400).json({ message: 'User already exists.' });
        }

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
        
    } catch(e) {
        next(e);
    }
});

routes.put('/:email', [userValidations.validateUserEmail], async (req, res) => {
    
    try {
        
        let result = userService.updateUser(req.params.email, req.body);

        result
            .then(user => {
                if(user) {
                    res.json({
                        name: user.name,
                        email: user.email
                    });
                } else {
                    res.status(400).json({
                        err: "User not found"
                    });
                }
            })
            .catch(err => {
                res.status(400).json({
                    err
                });
            });
    } catch(e) {
        next(e);
    }
});

routes.delete('/:email', async (req, res) => {
    
    try {
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
                });
            });
    } catch (e) {
        next(e);
    }
});

module.exports = routes;