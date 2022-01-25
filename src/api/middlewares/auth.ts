import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    if (!req.get('Authorization')) {
        return res.status(401).json("Please provide a token");
    }

    const token: string = req.get('Authorization')!;

    jwt.verify(token, config.get('configToken.seed'), (err, decoded) => {
        if (err) {
            return res.status(401).json(err);
        }

        // In case we wanted to inject the decoded user into the request
        // req.user = decoded.user;

        next();
    });
}

export default verifyToken;