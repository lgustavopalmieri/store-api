import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const cryptPass = bcrypt.hashSync(createUserDto.password, 8);
    const user = this.userRepository.create({
      ...createUserDto,
      password: cryptPass,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.userRepository.save(user);
  }

  async findAll() {
    const allUsers = this.userRepository.find({
      withDeleted: true,
    });
    return allUsers;
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

  async findOneForLogin(email: string) {
    const findOneUserName = await this.userRepository.findOne({ email: email });
    if (!findOneUserName) {
      throw new NotFoundException({
        error: 'Not found.',
        message: `Email ${email} not found.`,
      });
    }
    return findOneUserName;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userFound = await this.findOne(id);

    return this.userRepository.save({
      ...userFound,
      ...updateUserDto,
      updatedAt: new Date(),
    });
  }

  // async updatePassword(
  //   email: string,
  //   updateUserPasswordDto: UpdateUserPasswordDto,
  // ): Promise<User> {
  //   const findEmail = await this.userRepository.findOne({
  //     where: {
  //       email: email,
  //     },
  //   });

  //   if (findEmail) {
  //     if (findEmail.password === updateUserPasswordDto.password) {
  //       if (
  //         updateUserPasswordDto.newPassword !=
  //         updateUserPasswordDto.confirmNewPassword
  //       ) {
  //         throw new NotFoundException({
  //           error: 'Not found.',
  //           message: `${findEmail.password} not matches.`,
  //         });
  //       }
  //     }

  //     const passwordUpdate = this.userRepository.save({
  //       ...findEmail,
  //       ...updateUserPasswordDto,
  //       updatedAt: new Date(),
  //     });

  //     return passwordUpdate;
  //   }

  //   // const updatedPassword = this.userRepository.save({
  //   //   ...pass
  //   // })
  // }

  async remove(id: number) {
    const userFound = await this.findOne(id);
    return this.userRepository.softDelete(userFound);
  }

  async restore(id: number) {
    const userFound = await this.findOne(id);
    return this.userRepository.restore(userFound);
  }
}
