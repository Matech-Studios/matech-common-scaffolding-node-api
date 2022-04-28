interface UserLoginResponse {
    user: {
        _id: string;
        name: string;
        email: string;
    };
    token: string;
}

export default UserLoginResponse;