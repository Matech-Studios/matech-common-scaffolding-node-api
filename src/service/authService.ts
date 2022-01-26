import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserRequest from '../api/contracts/requests/userRequest';
import config from 'config';
import UserSchema from '../repository/models/userModel';
import UserEntity from '../core/entities/userEntity';
import UserLoginRequest from '../api/contracts/requests/userLoginRequest';

export default {

    login: async (userRequest: UserLoginRequest): Promise<UserEntity> => {

        const dbUser: any = await UserSchema
            .findOne({
                email: userRequest.email,
                status: true
            });

        if (!dbUser) {
            return null as any;
        }

        const validPassword = bcrypt.compareSync(userRequest.password, dbUser.password);

        if (!validPassword) {
            return null as any;
        }

        const token = jwt.sign(
            {
                user: {
                    _id: dbUser._id,
                    name: dbUser.name,
                    email: dbUser.email
                }
            },
            config.get('configToken.seed'),
            {
                expiresIn: config.get('configToken.expiration')
            });

        const userDto: UserEntity = {
            _id: dbUser._id,
            name: dbUser.name,
            email: dbUser.email,
            token: token,
            password: '',
            image: '',
            status: dbUser.status
        };

        return userDto;
    }
}