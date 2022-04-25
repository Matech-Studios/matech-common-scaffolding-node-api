import UserRequest from '../../../api/contracts/requests/userRequest';
import UserUpdateRequest from '../../../api/contracts/requests/userUpdateRequest';
import UserResponse from '../../../api/contracts/responses/userResponse';
import { UserController } from '../../../api/controllers';
import UserEntity from '../../../core/entities/UserEntity';
import { IUserService } from '../../../core/serviceInterfaces';

describe('Users', function () {

    let users: any = new Array(
        {
            id: 1,
            email: 'someone@matechstudios.com',
            name: 'John Matienzo',
            status: true
        },
        {
            id: 2,
            email: 'someoneelse@matechstudios.com',
            name: 'John Doe',
            status: false
        },
    );

    it('should return active users', async function () {

        // Arrange
        const listActiveUsersMock = jest.fn(async () => {
            return users;
        });

        const userService: IUserService = mockUserService(listActiveUsersMock);

        const controller = new UserController(userService);

        // Act
        const usersResponse: UserResponse[] = await controller.getUsers();

        // Assert
        expect(userService.listActiveUsers).toHaveBeenCalled();
        expect(usersResponse.length).toBe(2);

        const user: UserResponse = usersResponse[0];
        expect(user._id).toBe(1);
        expect(user.email).toBe('someone@matechstudios.com');
        expect(user.name).toBe('John Matienzo');
    });
});

const mockUserService = (listActiveUsersMock: () => Promise<UserEntity[]>) => {
    const userService: IUserService = {
        listActiveUsers: listActiveUsersMock,
        findByEmail: function (email: string): Promise<UserEntity | null> {
            throw new Error('Function not implemented.');
        },
        createUser: function (userRequest: UserRequest): Promise<boolean> {
            throw new Error('Function not implemented.');
        },
        updateUser: function (email: string, userRequest: UserUpdateRequest): Promise<boolean> {
            throw new Error('Function not implemented.');
        },
        deactivateUser: function (email: string): Promise<boolean> {
            throw new Error('Function not implemented.');
        }
    };

    return userService;
}