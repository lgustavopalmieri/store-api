import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const dataAlreadyExists = await this.userRepository.find({
      where: {
        ...(createUserDto.email ? { email: createUserDto.email } : {}),
        ...(createUserDto.cpf ? { cpf: createUserDto.cpf } : {}),
      },
      withDeleted: true,
    });

    if (dataAlreadyExists.length > 0) {
      throw new BadRequestException({
        error: 'Duplicated User params.',
        message:
          createUserDto.cpf || createUserDto.email
            ? `User with ${createUserDto.cpf} or ${createUserDto.email} already exists.`
            : 'Something went wrong. Try again later.',
      });
    }

    const cryptPass = bcrypt.hashSync(createUserDto.password, 8);
    const user = this.userRepository.create({
      ...createUserDto,
      password: cryptPass,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.userRepository.save(user);
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

  async findOne(id: number) {
    const oneUser = await this.userRepository.findOne(id);

    if (!oneUser) {
      throw new NotFoundException({
        error: 'Not found.',
        message: `User ${id} not found.`,
      });
    }

    return oneUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email || updateUserDto.cpf) {
      const userParamsExists = await this.userRepository.find({
        withDeleted: true,
        where: {
          cpf: updateUserDto.cpf,
          email: updateUserDto.email,
          id: Not(id),
        },
      });

      if (userParamsExists.length > 0) {
        throw new BadRequestException({
          error: 'Duplicated User params.',
          message:
            updateUserDto.cpf || updateUserDto.email
              ? `User with ${updateUserDto.cpf} or ${updateUserDto.email} already exists.`
              : 'Something went wrong. Try again later.',
        });
      }
    }
    const userFound = await this.findOne(id);

    return this.userRepository.save({
      ...userFound,
      ...updateUserDto,
      updatedAt: new Date(),
    });
  }

  async remove(id: number) {
    const userFound = await this.findOne(id);
    return this.userRepository.softDelete(userFound);
  }

  async restore(id: number) {
    const userFound = await this.findOne(id);
    return this.userRepository.restore(userFound);
  }
}
