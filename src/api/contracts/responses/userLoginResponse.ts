import UserLogin from "./UserLogin";

interface UserLoginResponse {
    user: UserLogin;
    token: string;
}

export default UserLoginResponse;