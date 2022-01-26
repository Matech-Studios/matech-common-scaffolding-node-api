import bcrypt from 'bcrypt';
import UserRequest from '../api/contracts/requests/userRequest';
import UserUpdateRequest from '../api/contracts/requests/userUpdateRequest';
import UserEntity from '../core/entities/userEntity';
import UserSchema from '../repository/models/userModel';

export default {

    listActiveUsers: async (): Promise<UserEntity[]> => {
        return await
            UserSchema
                .find({ 'status': true })
                .select({ name: 1, email: 1 });
    },

    findByEmail: async (email: string): Promise<UserEntity> => {
        const userResult: UserEntity = await UserSchema.findOne({ email }, (err: any, user: UserEntity) => {
            if (err) {
                console.log(err);
                return null;
            }

            return user;
        });

        return userResult;
    },

    createUser: async (userRequest: UserRequest): Promise<boolean> => {

        const hashedPassword = bcrypt.hashSync(userRequest.password, 10);

        const user = new UserSchema({
            email: userRequest.email,
            name: userRequest.name,
            password: hashedPassword
        });

        const userCreated = await user.save();
        return userCreated !== undefined;
    },

    updateUser: async (email: string, userRequest: UserUpdateRequest): Promise<UserEntity> => {

        let userToUpdate: any = {
            name: userRequest.name
        };

        if (userRequest.password !== undefined) {
            const hashedPassword = bcrypt.hashSync(userRequest.password, 10);
            userToUpdate.password = hashedPassword;
        }

        const user: UserEntity = await UserSchema.findOneAndUpdate({ 'email': email }, {
            $set: userToUpdate
        }, {
            new: true
        });

        return user;
    },

    deactivateUser: async (email: string): Promise<UserEntity> => {

        const user: UserEntity = await UserSchema.findOneAndUpdate({ 'email': email }, {
            $set: {
                status: false
            }
        }, {
            new: true
        });

        return user;
    }
}