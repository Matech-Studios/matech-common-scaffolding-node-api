import { Router, Request, Response, NextFunction } from 'express';
import UserDto from '../../core/interfaces/user_interface';
import UserRequest from '../contracts/requests/user_request';
import authService from '../../service/auth_service';
import UserLoginResponse from '../contracts/responses/user_login_response';

const routes = Router();

routes.post('/', async (req: Request, res: Response, next: NextFunction) => {

    // #swagger.tags = ['auth']

    try {
        const loginErrorMessage = 'Incorrect user or password.';
        const userContract: UserRequest = req.body;

        const user: UserDto = await authService.login(userContract);

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
            token: user.token
        }

        return res.json(userResponse);
    } catch (e) {
        next(e);
    }
});

export default routes;