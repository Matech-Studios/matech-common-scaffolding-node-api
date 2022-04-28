import UserEntity from '../entities/UserEntity';
import UserLoginRequest from '../../api/contracts/requests/UserLoginRequest';

export interface IAuthService {
    login(userRequest: UserLoginRequest): Promise<UserEntity>;
}