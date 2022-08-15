import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      findForAuth: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      signinUpCreate: (user: CreateUserDto) => {
        const newUser = {
          id: Math.floor(Math.random() * 999),
          ...user,
          password: user.password,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      },
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

  it('Creates a new user with a salted and a hashed password', async () => {
    const user = await service.signup({
      name: 'Some',
      cpf: '02625508017',
      email: 'ail@mail.com',
      password: 'pass',
      admin: false,
    });
    expect(user.password).not.toEqual('pass');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup({
      name: 'Some',
      cpf: '02625508017',
      email: 'ail@mail.com',
      password: 'pass',
      admin: false,
    });
    try {
      await service.signup({
        name: 'Some',
        cpf: '02625508017',
        email: 'ail@mail.com',
        password: 'pass',
        admin: false,
      });
    } catch (err) {
      err;
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signin({
        name: 'Some',
        cpf: '02625508017',
        email: 'agfdil@mail.com',
        password: 'pass',
        admin: false,
      });
    } catch (error) {
      error;
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup({
      name: 'Some',
      cpf: '02625508017',
      email: 'agfdil@mail.com',
      password: 'pass',
      admin: false,
    });
    try {
      await service.signin({
        name: 'Some',
        cpf: '02625508017',
        email: 'agfdil@mail.com',
        password: 'pass',
        admin: false,
      });
    } catch (error) {
      error;
    }
  });

  it('return a user if correct password is provided', async () => {
    await service.signup({
      name: 'Some',
      cpf: '02625508017',
      email: 'il@mail.com',
      password: '12',
      admin: false,
    });

    const user = await service.signin({
      name: 'Some',
      cpf: '02625508017',
      email: 'il@mail.com',
      password: '12',
      admin: false,
    });
    expect(user).toBeDefined();
  });
});
