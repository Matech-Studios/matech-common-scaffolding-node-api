import {
    Body,
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Path,
    Route,
    SuccessResponse,
    Res,
    Response,
    TsoaResponse,
} from "tsoa";
import User from '../../core/entities/user';
import userService from '../../service/userService';
import ErrorResponse from "../contracts/responses/errorResponse";
import UserResponse from "../contracts/responses/userResponse";
import UserRequest from "../contracts/requests/userRequest";
import UserUpdateRequest from "../contracts/requests/userUpdateRequest";

@Route("api/v1/users")
export class UsersController extends Controller {

    @Get("")
    public async getUsers(): Promise<UserResponse[]> {

        const users: User[] = await userService.listActiveUsers();

        if (users) {

            let usersResponse: UserResponse[] = [];
            users.map((u: User, i: number) => {
                usersResponse[i] = {
                    _id: u._id,
                    email: u.email,
                    name: u.name
                };
            });

            return usersResponse;
        }

        return null as any;
    }

    @Post("")
    @SuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, 'User already exists.')
    public async createUser(@Body() userRequest: UserRequest, @Res() userExists: TsoaResponse<400, ErrorResponse>): Promise<void> {

        const user: User = await userService.findByEmail(userRequest.email);

        if (user) {
            return userExists(400, {
                error: "User already exists."
            });
        }

        const created: boolean = await userService.createUser(userRequest);

        if (created) {
            return this.setStatus(201);
        }

        return this.setStatus(400);
    }

    @Put("{email}")
    @Response(404, 'Not Found')
    @Response(400, 'Bad request')
    public async updateUser(@Path() email: string, @Body() userRequest: UserUpdateRequest): Promise<void> {

        const user: User = await userService.findByEmail(email);

        if (!user) {
            return this.setStatus(404);
        }

        const updatedUser: User = await userService.updateUser(email, userRequest);

        if (!updatedUser) {
            return this.setStatus(400);
        }

        return;
    }

    @Delete("{email}")
    @Response(404, 'Not Found')
    @Response(400, 'Bad Request')
    public async deleteUser(@Path() email: string): Promise<void> {

        const user: User = await userService.findByEmail(email);

        if (!user) {
            return this.setStatus(404);
        }

        const deletedUser: User = await userService.deactivateUser(email);

        if (!deletedUser) {
            return this.setStatus(400);
        }

        return;
    }
}