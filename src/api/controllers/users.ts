import { Router, Request, Response, NextFunction } from 'express';
import verifyToken from '../middlewares/auth';
import userValidations from '../validations/user_validations';
import userService from '../../service/user_service';
import UserDto from '../../core/interfaces/user_interface';

const routes = Router();

routes.get('/', async (req: Request, res: Response, next: NextFunction) => {

    // #swagger.tags = ['users']

    try {
        let result: Promise<UserDto[]> = userService.listActiveUsers();

        result
            .then((users: UserDto[]) => {
                return res.json(users);
            })
            .catch(err => {
                return res.status(400).json({
                    error: err
                });
            });

    } catch (e) {
        next(e);
    }
});

routes.post('/', userValidations.validateUser, async (req: Request, res: Response, next: NextFunction) => {

    // #swagger.tags = ['users']

    try {
        let body = req.body;

        const user: UserDto = await userService.findByEmail(body.email);

        if (user) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        let userDto: Promise<UserDto> = userService.createUser(body);

        userDto
            .then((user: UserDto) => {
                res.status(201).json({
                    name: user.name,
                    email: user.email
                });
            })
            .catch(err => {
                res.status(400).json({ err });
            });

    } catch (e) {
        next(e);
    }
});

routes.put('/:email', [userValidations.validateUserEmail], async (req: Request, res: Response, next: NextFunction) => {

    // #swagger.tags = ['users']

    try {

        let result: Promise<UserDto> = userService.updateUser(req.params.email, req.body);

        result
            .then((user: UserDto) => {
                if (user) {
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
            .catch((err: any) => {
                res.status(400).json({
                    err
                });
            });
    } catch (e) {
        next(e);
    }
});

routes.delete('/:email', [verifyToken], async (req: Request, res: Response, next: NextFunction) => {

    // #swagger.tags = ['users']

    try {
        let result: Promise<UserDto> = userService.deactivateUser(req.params.email);

        result
            .then((user: UserDto) => {
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

export default routes;
