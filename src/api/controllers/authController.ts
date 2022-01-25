import { Router, Request, Response, NextFunction } from 'express';
import User from '../../core/entities/user';
import UserRequest from '../contracts/requests/userRequest';
import authService from '../../service/authService';
import UserLoginResponse from '../contracts/responses/userLoginResponse';

const routes = Router();

routes.post('/', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const loginErrorMessage = 'Incorrect user or password.';
        const userContract: UserRequest = req.body;

        const user: User = await authService.login(userContract);

        if (!user) {
            return res.status(400).json({
                error: loginErrorMessage
            });
        }

        const userResponse: UserLoginResponse = {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token: user.token!
        }

        return res.json(userResponse);
    } catch (e) {
        next(e);
    }
});

export default routes;