const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const routes = express.Router();
const User = require('../../repository/models/user_model');
const config = require('config');

routes.post('/', async (req, res) => {
    
    // #swagger.tags = ['auth']

    try {
        const loginErrorMessage = 'Incorrect user or password.';

        User
            .findOne({
                email: req.body.email,
                status: true
            })
            .then(dbData => {
                if(!dbData) {

                    return res.status(400).json({
                        error: loginErrorMessage
                    });
                }

                const validPassword = bcrypt.compareSync(req.body.password, dbData.password); 
                    
                if(!validPassword) {
                    return res.status(400).json({
                        error: loginErrorMessage
                    });
                }

                const token = jwt.sign(
                {
                    user: {
                        _id: dbData._id,
                        name: dbData.name,
                        email: dbData.email
                    }
                },
                config.get('configToken.seed'),
                {
                    expiresIn: config.get('configToken.expiration')
                });
                
                return res.json({
                    user: {
                        _id: dbData._id,
                        name: dbData.name,
                        email: dbData.email
                    },
                    token
                });
            })
            .catch(err => {
                return res.status(500).json({
                    error: 'Service error: ' + err
                });
            });
    } catch(e) {
        next(e);
    }
});

module.exports = routes;