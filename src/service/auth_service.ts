import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import UserRequest from '../api/contracts/requests/user_request';
import * as config from 'config';
import UserSchema from '../repository/models/user_model';
import UserDto from '../core/interfaces/user_interface';

export default {

    login: async (userRequest: UserRequest): Promise<UserDto> => {

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

        const userDto: UserDto = {
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