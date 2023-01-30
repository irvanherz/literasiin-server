import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Identity } from './entities/identity.entity';
import { User } from './entities/user.entity';
import { FindManyFilter } from './users.interface';

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

  async findMany(filter: FindManyFilter = {}) {
    const result = this.usersRepository.findAndCount({
      where: {
        email: filter.email ? filter.email : undefined,
      },
    });
    return result;
  }

  async findById(id: number) {
    const result = this.usersRepository.findOne({ where: { id } });
    return result;
  }

  async findByEmail(email: string) {
    const result = this.usersRepository.findOne({ where: { email } });
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
