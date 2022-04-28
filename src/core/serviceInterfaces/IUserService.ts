import UserEntity from '../entities/UserEntity';
import UserRequest from '../../api/contracts/requests/UserRequest';
import UserUpdateRequest from '../../api/contracts/requests/UserUpdateRequest';

export interface IUserService {
    listActiveUsers(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity | null>;
    createUser(userRequest: UserRequest): Promise<boolean>;
    updateUser(email: string, userRequest: UserUpdateRequest): Promise<boolean>;
    deactivateUser(email: string): Promise<boolean>;
}