import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const fakeUsersService: Partial<UsersService> = {
      findAll: () => Promise.resolve([]),
      signinUpCreate: (createUserDto: CreateUserDto) =>
        Promise.resolve({
          id: 1,
          name: 'Some',
          cpf: '02625508017',
          email: 'someemail@mail.com',
          password: 'pass',
          admin: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: new Date(),
        }),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
});
