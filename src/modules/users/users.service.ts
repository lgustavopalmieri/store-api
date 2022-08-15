import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async signinUpCreate(createUserDto: CreateUserDto) {
    const user = this.userRepository.create({
      ...createUserDto,
      password: createUserDto.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saveUser = await this.userRepository.save(user);

    if (!saveUser) {
      throw new InternalServerErrorException(
        'Problem when creating your account.',
      );
    }

    return saveUser;
    // return this.userRepository.save(user);
  }

  async findEmails() {
    const getEmails = this.userRepository.find({ select: ['email'] });
    return getEmails;
  }

  async findAll(query: UserDto) {
    const where = {
      ...(query.name ? { name: query.name } : {}),
      ...(query.email ? { email: query.email } : {}),
    };
    return this.userRepository.find({
      where,
      withDeleted: true,
    });
  }

  findForAuth(email: string) {
    return this.userRepository.find({
      email,
    });
  }

  async findOneForLogout(id: number) {
    if (!id) {
      return null;
    }
    return this.userRepository.findOne(id);
  }

  async findOne(id: number) {
    const oneUser = await this.userRepository.findOne(id, {
      withDeleted: true,
    });

    if (!oneUser) {
      throw new NotFoundException({
        error: 'Not found.',
        message: `User ${id} not found.`,
      });
    }

    return oneUser;
  }

  // async update(id: number, updateUserDto: UpdateUserDto) {
  //   if (updateUserDto.email || updateUserDto.cpf) {
  //     const userParamsExists = await this.userRepository.find({
  //       withDeleted: true,
  //       where: {
  //         cpf: updateUserDto.cpf,
  //         email: updateUserDto.email,
  //         id: Not(id),
  //       },
  //     });

  //     if (userParamsExists.length > 0) {
  //       throw new BadRequestException({
  //         error: 'Duplicated User params.',
  //         message:
  //           updateUserDto.cpf || updateUserDto.email
  //             ? `User with ${updateUserDto.cpf} or ${updateUserDto.email} already exists.`
  //             : 'Something went wrong. Try again later.',
  //       });
  //     }
  //   }
  //   const userFound = await this.findOne(id);

  //   return this.userRepository.save({
  //     ...userFound,
  //     ...updateUserDto,
  //     updatedAt: new Date(),
  //   });
  // }

  //created for test
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return this.userRepository.save({
      ...user,
      ...updateUserDto,
      updatedAt: new Date(),
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(updateUserDto.password, salt, 32)) as Buffer;
    if (storedHash === hash.toString('hex')) {
      throw new BadRequestException('Você não pode usar a mesma senha.');
    } else {
      const newSalt = randomBytes(8).toString('hex');
      const newHash = (await scrypt(
        updateUserDto.password,
        newSalt,
        32,
      )) as Buffer;
      const result = newSalt + '.' + newHash.toString('hex');
      return this.userRepository.save({
        ...user,
        ...updateUserDto,
        password: result,
        updatedAt: new Date(),
      });
    }
  }

  async remove(id: number) {
    const userFound = await this.findOne(id);
    return this.userRepository.softDelete(userFound);
  }

  async delete(id: number) {
    const userFound = await this.findOne(id);
    const deleted = await this.userRepository.delete(userFound);
    if (deleted) {
      return true;
    }
    return false;
  }

  async restore(id: number) {
    const userFound = await this.findOne(id);
    return this.userRepository.restore(userFound);
  }
}
