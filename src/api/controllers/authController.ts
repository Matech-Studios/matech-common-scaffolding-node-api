import {
    Body,
    Controller,
    Post,
    Route,
    SuccessResponse,
    Res,
    Response,
    Tags,
    TsoaResponse,
} from "tsoa";
import UserEntity from '../../core/entities/userEntity';
import authService from '../../service/authService';
import ErrorResponse from "../contracts/responses/errorResponse";
import UserLoginResponse from "../contracts/responses/userLoginResponse";
import UserLoginRequest from "../contracts/requests/userLoginRequest";

@Route("api/v1/auth")
@Tags("auth")
export class AuthController extends Controller {

    @Post("")
    @SuccessResponse("200", "OK")
    @Response<ErrorResponse>(400, 'Incorrect user or password.')
    @Response<ErrorResponse>(500, 'Internal server error.')
    public async loginUser(@Body() userRequest: UserLoginRequest, @Res() incorrectUserOrPassword: TsoaResponse<400, ErrorResponse>): Promise<UserLoginResponse> {

        const user: UserEntity = await authService.login(userRequest);

        if (!user) {
            return incorrectUserOrPassword(400, {
                error: "Incorrect user or password."
            });
        }

        const userResponse: UserLoginResponse = {
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            token: user.token!
        }

        return userResponse;
    }
}