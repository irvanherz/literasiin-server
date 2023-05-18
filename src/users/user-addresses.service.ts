import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserAddressFilterDto } from './dto/user-addresses.dto';
import { UserAddress } from './entities/user-address';

@Injectable()
export class UserAddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private addressesRepo: Repository<UserAddress>,
  ) {}

  async create(payload: Partial<UserAddress>) {
    const result = await this.addressesRepo.save(payload);
    return result;
  }

  async findMany(filter: UserAddressFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = this.addressesRepo.findAndCount({
      where: {},
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    if (!id) throw new BadRequestException();
    const result = this.addressesRepo.findOne({
      where: { id },
    });
    return result;
  }

  async updateById(id: number, payload: UpdateUserDto) {
    if (!id) throw new BadRequestException();
    const result = await this.addressesRepo.save({
      id,
      ...payload,
    });
    return result;
  }

  async deleteById(id: number) {
    if (!id) throw new BadRequestException();
    const result = await this.addressesRepo.delete(id);
    return result.affected;
  }
}
