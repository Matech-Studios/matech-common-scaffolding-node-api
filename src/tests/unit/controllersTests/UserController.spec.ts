import { HttpStatusCodeLiteral, TsoaResponse } from 'tsoa';
import UserRequest from '../../../api/contracts/requests/UserRequest';
import UserUpdateRequest from '../../../api/contracts/requests/UserUpdateRequest';
import ErrorResponse from '../../../api/contracts/responses/ErrorResponse';
import UserResponse from '../../../api/contracts/responses/UserResponse';
import { UserController } from '../../../api/controllers';
import UserEntity from '../../../core/entities/UserEntity';
import { IUserService } from '../../../core/serviceInterfaces';

afterEach(() => {
    jest.clearAllMocks();
});

const users: UserEntity[] = [
    {
        id: "1",
        email: 'someone@matechstudios.com',
        name: 'John Matienzo',
        status: true
    },
    {
        id: "2",
        email: 'someoneelse@matechstudios.com',
        name: 'John Doe',
        status: false
    }
];

describe('Get Users', function () {

    it('should return active users', async () => {

        // Arrange
        const listActiveUsersMock = jest.fn(async () => {
            return users;
        });

        const userService: IUserService = mockUserServiceFactory(listActiveUsersMock);

        const controller = new UserController(userService);

        // Act
        const usersResponse: UserResponse[] = await controller.getUsers();

        // Assert
        expect(userService.listActiveUsers).toHaveBeenCalled();
        expect(usersResponse.length).toBe(2);

        const user: UserResponse = usersResponse[0];
        expect(user._id).toBe('1');
        expect(user.email).toBe('someone@matechstudios.com');
        expect(user.name).toBe('John Matienzo');
    });

    it('should return null when no active users', async () => {

        // Arrange
        const listActiveUsersMock = jest.fn(async () => {
            return [];
        });

        const userService: IUserService = mockUserServiceFactory(listActiveUsersMock);

        const controller = new UserController(userService);

        // Act
        const usersResponse: UserResponse[] = await controller.getUsers();

        // Assert
        expect(userService.listActiveUsers).toHaveBeenCalled();
        expect(usersResponse.length).toStrictEqual(0);
    });
});

describe('Create User', () => {

    const userFound: UserEntity = users[0];

    const userRequest: UserRequest = {
        email: users[0].email,
        name: 'John Matienzo',
        password: 'pass1234.'
    };

    const createUserMock = jest.fn(async () => {
        return true;
    });

    it('should throw existing user error', async () => {

        const findByEmailMock = jest.fn(async () => {
            return userFound;
        });

        const userService: IUserService = mockUserServiceFactory(null as any, findByEmailMock);

        const controller = new UserController(userService);

        await controller.createUser(userRequest, createUserErrorCallback);

        expect(userService.findByEmail).toHaveBeenCalled();

        const mockedCallArgument: string[] = findByEmailMock.mock.calls[0];
        expect(mockedCallArgument[0]).toBe(userRequest.email);
    });

    it('should create user', async () => {

        const findByEmailMock = jest.fn(async () => {
            return null;
        });

        const userService: IUserService = mockUserServiceFactory(null as any, findByEmailMock, createUserMock);

        const controller = new UserController(userService);

        await controller.createUser(userRequest, createUserErrorCallback);

        expect(userService.findByEmail).toHaveBeenCalled();
        expect(userService.createUser).toHaveBeenCalled();
        expect(controller.getStatus()).toEqual(201);

        const findMockedCallArgument: string[] = findByEmailMock.mock.calls[0];
        expect(findMockedCallArgument[0]).toBe(userRequest.email);

        const createMockedCallArgument: UserRequest[] = createUserMock.mock.calls[0];
        expect(createMockedCallArgument[0]).toEqual(userRequest);
    });
});

describe('Update user', () => {

    const userFound: UserEntity = users[0];

    const userRequest: UserRequest = {
        email: users[0].email,
        name: 'John Matienzo',
        password: 'pass1234.'
    };

    it('should throw user not found error', async () => {

        const findByEmailMock = jest.fn(async () => {
            return null;
        });

        const userService: IUserService = mockUserServiceFactory(null as any, findByEmailMock);

        const controller = new UserController(userService);

        await controller.updateUser(userRequest.email, userRequest);

        expect(userService.findByEmail).toHaveBeenCalled();
        expect(controller.getStatus()).toEqual(404);

        const findMockedCallArgument: string[] = findByEmailMock.mock.calls[0];
        expect(findMockedCallArgument[0]).toBe(userRequest.email);
    });

    it('should update user', async () => {

        const findByEmailMock = jest.fn(async () => {
            return userFound;
        });

        const updateUserMock = jest.fn(async () => {
            return true;
        });

        const userService: IUserService = mockUserServiceFactory(null as any, findByEmailMock, null as any, updateUserMock);

        const controller = new UserController(userService);

        await controller.updateUser(userRequest.email, userRequest);

        expect(userService.findByEmail).toHaveBeenCalled();
        expect(userService.updateUser).toHaveBeenCalled();
        expect(controller.getStatus()).toEqual(undefined);  // = 204 in tsoa

        const findMockedCallArgument: string[] = findByEmailMock.mock.calls[0];
        expect(findMockedCallArgument[0]).toBe(userRequest.email);

        const updateMockedCallArgument: [][] = updateUserMock.mock.calls[0];
        expect(updateMockedCallArgument[0]).toBe(userRequest.email);
        expect(updateMockedCallArgument[1]).toEqual(userRequest);
    });
});

describe('Delete user', () => {

    const userFound: UserEntity = users[0];

    const userRequest: UserRequest = {
        email: users[0].email,
        name: 'John Matienzo',
        password: 'pass1234.'
    };

    it('should throw user not found error', async () => {

        const findByEmailMock = jest.fn(async () => {
            return null;
        });

        const userService: IUserService = mockUserServiceFactory(null as any, findByEmailMock);

        const controller = new UserController(userService);

        await controller.deleteUser(userRequest.email);

        expect(userService.findByEmail).toHaveBeenCalled();
        expect(controller.getStatus()).toEqual(404);

        const findMockedCallArgument: string[] = findByEmailMock.mock.calls[0];
        expect(findMockedCallArgument[0]).toBe(userRequest.email);
    });

    it('should deactivate user', async () => {

        const findByEmailMock = jest.fn(async () => {
            return userFound;
        });

        const deactivateUserMock = jest.fn(async () => {
            return true;
        });

        const userService: IUserService = mockUserServiceFactory(null as any, findByEmailMock, null as any, null as any, deactivateUserMock);

        const controller = new UserController(userService);

        await controller.deleteUser(userRequest.email);

        expect(userService.findByEmail).toHaveBeenCalled();
        expect(userService.deactivateUser).toHaveBeenCalled();
        expect(controller.getStatus()).toEqual(undefined);  // = 204 in tsoa

        const findMockedCallArgument: string[] = findByEmailMock.mock.calls[0];
        expect(findMockedCallArgument[0]).toBe(userRequest.email);

        const deactivateMockedCallArgument: string[] = deactivateUserMock.mock.calls[0];
        expect(deactivateMockedCallArgument[0]).toBe(userRequest.email);
    });
});

const mockUserServiceFactory = (
    listActiveUsersMock: () => Promise<UserEntity[]> = null as any,
    findByEmailMock: (email: string) => Promise<UserEntity | null> = null as any,
    createUserMock: (userRequest: UserRequest) => Promise<boolean> = null as any,
    updateUserMock: (email: string, userRequest: UserUpdateRequest) => Promise<boolean> = null as any,
    deactivateUserMock: (email: string) => Promise<boolean> = null as any
) => {
    const userService: IUserService = {
        listActiveUsers: listActiveUsersMock,
        findByEmail: findByEmailMock,
        createUser: createUserMock,
        updateUser: updateUserMock,
        deactivateUser: deactivateUserMock
    };

    return userService;
}

const createUserErrorCallback: TsoaResponse<HttpStatusCodeLiteral, ErrorResponse, {}> = (status: number, data: ErrorResponse, headers?: {} | undefined) => {
    expect(status).toEqual(400);
    expect(data).toEqual({ 'error': 'User already exists.' });
};