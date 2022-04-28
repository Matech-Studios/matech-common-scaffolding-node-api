import { HttpStatusCodeLiteral, TsoaResponse } from "tsoa";
import UserLoginRequest from "../../../api/contracts/requests/UserLoginRequest";
import ErrorResponse from "../../../api/contracts/responses/ErrorResponse";
import { AuthController } from "../../../api/controllers";
import UserEntity from "../../../core/entities/UserEntity";
import { IAuthService } from "../../../core/serviceInterfaces";


afterEach(() => {
    jest.clearAllMocks();
});

describe('Login user', () => {

    const userFound: UserEntity = {
        id: "1",
        email: 'someone@matechstudios.com',
        name: 'John Matienzo',
        status: true,
        token: "this is a token"
    };

    const userLoginRequest: UserLoginRequest = {
        email: userFound.email,
        password: 'pass1234.'
    };

    it('should throw user not found error', async () => {

        const loginMock = jest.fn(async () => {
            return null as any;
        });

        const authService: IAuthService = {
            login: loginMock
        };

        const controller = new AuthController(authService);

        await controller.loginUser(userLoginRequest, incorrectUserOrPasswordCallback);

        expect(authService.login).toHaveBeenCalled();
    });

    it('should login user', async () => {

        const loginMock = jest.fn(async () => {
            return userFound;
        });

        const authService: IAuthService = {
            login: loginMock
        };

        const controller = new AuthController(authService);

        const userResponse = await controller.loginUser(userLoginRequest, incorrectUserOrPasswordCallback);

        expect(authService.login).toHaveBeenCalled();
        expect(userResponse.token).toEqual(userFound.token);
        expect(userResponse.user._id).toEqual(userFound.id);
        expect(userResponse.user.email).toEqual(userFound.email);
        expect(userResponse.user.name).toEqual(userFound.name);
    });

});

const incorrectUserOrPasswordCallback: TsoaResponse<HttpStatusCodeLiteral, ErrorResponse, {}> = (status: number, data: ErrorResponse, headers?: {} | undefined) => {
    expect(status).toEqual(400);
    expect(data).toEqual({ 'error': 'Incorrect user or password.' });
};