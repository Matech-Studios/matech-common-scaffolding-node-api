import { Request, Response, NextFunction } from 'express';
import userSchemaValidation from './user_schema_validation';

export default {
    validateUser: (req: Request, res: Response, next: NextFunction) => {

        const { error, value } = userSchemaValidation.validate({
            name: req.body.name,
            email: req.body.email
        });

        if (error) {
            return res.status(400).json(error);
        }

        next();
    },

    validateUserEmail: (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = userSchemaValidation.validate({
            name: req.body.name
        });

        if (error) {
            return res.status(400).json(error);
        }

        next();
    }
}
