import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { Identity } from './entities/identity.entity';
import { UserFollow } from './entities/user-follow.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Identity)
    private identitiesRepository: Repository<Identity>,
    @InjectRepository(UserFollow)
    private userFollowRepo: Repository<UserFollow>,
  ) {}

  async create(data: CreateUserDto) {
    const user = this.usersRepository.create(data);
    const result = await this.usersRepository.save(user);
    return result;
  }

  async findMany(filters: UserFiltersDto) {
    const take = filters.limit || 1;
    const skip = (filters.page - 1) * take;
    const result = this.usersRepository.findAndCount({
      where: {
        role: filters.role ? (filters.role as any) : undefined,
        fullName: filters.search ? ILike(`%${filters.search}%`) : undefined,
        gender: filters.gender ? (filters.gender as any) : undefined,
      },
      relations: {
        photo: true,
      },
      skip,
      take,
      order: { [filters.sortBy]: filters.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    if (!id) throw new BadRequestException();
    const result = this.usersRepository.findOne({
      where: { id },
      relations: {
        photo: true,
      },
    });
    return result;
  }

  async findByUsername(username: string) {
    if (!username) throw new BadRequestException();
    const result = this.usersRepository.findOne({
      where: { username },
      relations: {
        photo: true,
      },
    });
    return result;
  }

  async findByEmail(email: string) {
    if (!email) throw new BadRequestException();
    const result = this.usersRepository.findOne({
      where: { email },
      relations: {
        photo: true,
      },
    });
    return result;
  }

  async findByEmailOrUsername(id: string) {
    if (!id) throw new BadRequestException();
    const result = this.usersRepository.findOne({
      where: [{ email: id }, { username: id }],
      relations: {
        photo: true,
      },
    });
    return result;
  }

  async updateById(id: number, payload: UpdateUserDto) {
    if (!id) throw new BadRequestException();
    const result = await this.usersRepository.save({
      id,
      ...payload,
    });
    return result;
  }

  async deleteById(id: number) {
    if (!id) throw new BadRequestException();
    const result = await this.usersRepository.softDelete(id);
    return result.affected;
  }

  async updateLastLoginAt(id: number, timestamp?: Date) {
    timestamp = timestamp || new Date();
    const result = await this.usersRepository.update(id, {
      lastLoginAt: timestamp,
    });
    return result.affected;
  }

  async validate(type: string, email: string, key: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    const identity = await this.identitiesRepository.findOne({
      where: { userId: user.id, type },
    });
    const match = bcrypt.compare(key, identity.key);
    if (!match) return false;
    return user;
  }

  async followUser(followerId: number, followingId: number) {
    const data = this.userFollowRepo.create({ followerId, followingId });
    const link = await this.userFollowRepo.save(data);
    return link;
  }

  async unfollowUser(followerId: number, followingId: number) {
    const result = await this.userFollowRepo.delete({
      followerId,
      followingId,
    });
    return result.affected;
  }

  async findContextByUserId(userId: number, currentUserId: number) {
    const hasFollowing = currentUserId
      ? await this.userFollowRepo.exist({
          where: { followerId: currentUserId, followingId: userId },
        })
      : false;
    const hasFollowed = currentUserId
      ? await this.userFollowRepo.exist({
          where: { followerId: userId, followingId: currentUserId },
        })
      : false;
    const numFollowers = await this.userFollowRepo.count({
      where: { followingId: userId },
    });
    const numFollowing = await this.userFollowRepo.count({
      where: { followerId: userId },
    });
    return {
      hasFollowing,
      hasFollowed,
      numFollowers,
      numFollowing,
    };
  }

  async findManyFollowing(userId: number) {
    const result = await this.usersRepository.findAndCount({
      where: { followers: { id: userId } },
    });

    return result;
  }

  async findManyFollowers(userId: number) {
    const result = await this.usersRepository.findAndCount({
      where: { following: { id: userId } },
    });
    return result;
  }
}
