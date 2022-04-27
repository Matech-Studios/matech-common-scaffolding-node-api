import { UserDto } from "../../../core/Dto/UserDto";
import UserEntity from "../../../core/entities/UserEntity";
import { IUserRepository } from "../../../core/repositoryInterfaces/IUserRepository";
import { UserService } from "../../../services";

afterEach(() => {
    jest.clearAllMocks();
});

const usersDto: UserDto[] = [
    {
        _id: "1",
        email: 'someone@matechstudios.com',
        name: 'John Matienzo',
        status: true
    },
    {
        _id: "2",
        email: 'someoneelse@matechstudios.com',
        name: 'John Doe',
        status: true
    }
];

describe('List Active Users', () => {

    it('should return active users only', async () => {

        const findAsyncMock = jest.fn(async () => {
            return usersDto;
        });

        const userRepository: IUserRepository = {
            findByIdAsync: null as any,
            findByEmailAsync: null as any,
            findAsync: findAsyncMock,
            addAsync: null as any,
            updateAsync: null as any,
            deleteAsync: null as any
        }

        const service = new UserService(userRepository);

        const activeUsers: UserEntity[] = await service.listActiveUsers();

        expect(findAsyncMock).toHaveBeenCalled();
        expect(activeUsers.length).toEqual(2);

        activeUsers.forEach(element => {
            expect(element.status).toEqual(true);
        });
    })
});