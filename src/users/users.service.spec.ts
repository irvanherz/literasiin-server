/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  UpdateResult,
} from 'typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const fakeUsersRepo: Partial<Repository<User>> = {
    create: ((data) => {
      return new User();
    }) as any,
    save: ((data) => {
      const user = new User();
      user.id = 1;
      return user;
    }) as any,
    findAndCount: async (filter: FindManyOptions<User>) => {
      return Promise.resolve([[], 0]);
    },
    findOne: (options: FindOneOptions<User>) => {
      const fakeUser = new User();
      return Promise.resolve(fakeUser);
    },
    update(criteria, partialEntity) {
      return Promise.resolve({ affected: 1 } as UpdateResult);
    },
    softDelete: (criteria) => {
      return Promise.resolve({ affected: 1 } as UpdateResult);
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: fakeUsersRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should return user contains id', async () => {
      const result = await service.create({});
      expect(result).toBeInstanceOf(User);
      expect(typeof result.id).toBe('number');
    });
  });
  describe('findMany', () => {
    it('should return users and count', async () => {
      const result = await service.findMany();

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(Array.isArray(result[0])).toBe(true);
      expect(typeof result[1]).toBe('number');
    });
  });
  describe('findById', () => {
    it('should return user', async () => {
      expect(await service.findById(1)).toBeInstanceOf(User);
    });
  });
  describe('updateById', () => {
    it('should return affected rows count', async () => {
      expect(await service.updateById(1, {})).toBe(1);
    });
  });
  describe('deleteById', () => {
    it('should return affected rows count', async () => {
      expect(await service.deleteById(1)).toBe(1);
    });
  });
});
