import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { Identity } from './entities/identity.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Identity)
    private identitiesRepository: Repository<Identity>,
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
        fullName: filters.search ? Like(`%${filters.search}%`) : undefined,
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
    const result = this.usersRepository.findOne({
      where: { id },
      relations: {
        photo: true,
      },
    });
    return result;
  }

  async findByUsername(username: string) {
    const result = this.usersRepository.findOne({
      where: { username },
      relations: {
        photo: true,
      },
    });
    return result;
  }

  async findByEmail(email: string) {
    const result = this.usersRepository.findOne({
      where: { email },
      relations: {
        photo: true,
      },
    });
    return result;
  }

  async updateById(id: number, data: UpdateUserDto) {
    const result = await this.usersRepository.update(id, data);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.usersRepository.softDelete(id);
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
}
