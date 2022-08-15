import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import TestUtil from '../../../src/common/test/TestUtil';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn((query) => query.where?.name || query.where?.email),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  beforeEach(() => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.save.mockReset();
    mockRepository.update.mockReset();
    mockRepository.softDelete.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('Should return all users', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.find.mockReturnValue([user, user]);
      const users = await service.findAll({
        id: null,
        name: '',
        email: '',
      });
      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
    it('Should return an user by name', async () => {
      const user = TestUtil.giveMeAValidUser();
      const findByName = mockRepository.find.mockReturnValue([user]);
      const result = await service.findAll({
        name: user.name,
      } as any);
      expect(findByName).toHaveBeenCalledTimes(1);
      expect(result).toEqual([user]);
      expect(findByName).toHaveBeenLastCalledWith({
        where: { name: user.name },
        withDeleted: true,
      });
    });
    it('Should return an empty array if no query result is found', async () => {
      const user = TestUtil.giveMeAValidUser();
      const findByName = mockRepository.find.mockReturnValue([]);

      const result = await service.findAll({
        name: 'Tenent Dan',
      } as any);

      expect(findByName).toHaveBeenLastCalledWith({
        where: { name: 'Tenent Dan' },
        withDeleted: true,
      });
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('Should find an existing user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      const userFound = await service.findOne(1);
      expect(userFound).toMatchObject({
        name: user.name,
      });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(userFound.name).not.toBe('Bubo');
      expect(userFound.email).toBe('valid@email.com');
    });
    it('Should return an exception when does not find an user', async () => {
      mockRepository.findOne.mockReturnValue(null);
      expect(service.findOne(12)).rejects.toBeInstanceOf(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });
  describe('create user', () => {
    it('Should create an user', async () => {
      const user = TestUtil.createAValidUser();
      mockRepository.save.mockReturnValue(user);
      mockRepository.create.mockReturnValue(user);
      const savedUser = await service.signinUpCreate(user);
      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(user.name).toBe('Buba');
    });
    it('Should return an exception when doesnt create an user', async () => {
      const user = TestUtil.createAValidUser();
      mockRepository.save.mockReturnValue(null);
      mockRepository.create.mockReturnValue(user);

      await service.signinUpCreate(user).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problem when creating your account.',
        });
      });
      expect(mockRepository.create).toBeCalledTimes(1);
      expect(mockRepository.save).toBeCalledTimes(1);
    });
  });
  describe('update user', () => {
    it('Should update an user', async () => {
      const user = TestUtil.giveMeAValidUser();
      const updatedUser = { name: 'Tenent Dan' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      mockRepository.save.mockReturnValue({
        ...user,
        ...updatedUser,
      });
      //updateUser created just for this test
      const resultUser = await service.updateUser(1, {
        ...user,
        ...updatedUser,
      });

      expect(user.name).not.toEqual({ name: 'Buba' });
      expect(resultUser).toMatchObject({ name: 'Tenent Dan' });
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(mockRepository.findOne).toBeCalledTimes(1);
    });
  });
  describe('delete user', () => {
    it('Should delete an existing user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.delete.mockReturnValue(user);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.delete(1);

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(1);
    });

    it('Should not delete an inexisting user', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.delete.mockReturnValue(null);
      mockRepository.findOne.mockReturnValue(user);

      const deletedUser = await service.delete(12);

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toBeCalledTimes(1);
      expect(mockRepository.delete).toBeCalledTimes(2);
    });
  });
});
