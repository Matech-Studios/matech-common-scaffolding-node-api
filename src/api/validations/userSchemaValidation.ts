import Joi from 'joi';

const userSchemaValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

export default userSchemaValidation;