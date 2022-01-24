import * as bcrypt from 'bcrypt';
import UserRequest from '../api/contracts/requests/user_request';
import UserDto from '../core/interfaces/user_interface';
import UserSchema from '../repository/models/user_model';

export default {

    listActiveUsers: async () => {
        const users: UserDto[] = await
            UserSchema
                .find({ 'status': true })
                .select({ name: 1, email: 1 });

        return users;
    },

    findByEmail: async (email: string) => {
        const userResult: UserDto = await UserSchema.findOne({ email }, (err: any, user: UserDto) => {
            if (err) {
                console.log(err);
                return null;
            }

            return user;
        });

        return userResult;
    },

    createUser: async (userRequest: UserRequest): Promise<UserDto> => {

        const hashedPassword = bcrypt.hashSync(userRequest.password, 10);

        const user = new UserSchema({
            email: userRequest.email,
            name: userRequest.name,
            password: hashedPassword
        });

        return await user.save();
    },

    updateUser: async (email: string, userRequest: UserRequest): Promise<UserDto> => {

        const user: UserDto = await UserSchema.findOneAndUpdate({ 'email': email }, {
            $set: {
                name: userRequest.name,
                password: userRequest.password
            }
        }, {
            new: true
        });

        return user;
    },

    deactivateUser: async (email: string): Promise<UserDto> => {

        const user: UserDto = await UserSchema.findOneAndUpdate({ 'email': email }, {
            $set: {
                status: false
            }
        }, {
            new: true
        });

        return user;
    }
}