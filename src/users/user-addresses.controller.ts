import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserAddressDto } from './dto/user-addresses.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserAddressesService } from './user-addresses.service';

@Controller()
export class UsersAddressesController {
  constructor(private readonly addressesService: UserAddressesService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('users/addresses')
  async create(@Body() payload: CreateUserAddressDto, @User() currentUser) {
    payload.userId = sanitizeFilter(payload.userId || 'me', { currentUser });
    if (currentUser?.id !== payload.userId) throw new ForbiddenException();
    // const coor = payload.location.split(',');
    // payload.location = {
    //   type: 'Point',
    //   coordinates: [coor[1], coor[0]],
    // } as any;
    const user = await this.addressesService.create(payload as any);
    return { data: user };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('users/addresses')
  async findMany(@Query() filters: UserFiltersDto) {
    const [users, count] = await this.addressesService.findMany(filters);
    const numPages = Math.ceil(count / filters.limit);
    const meta = {
      page: filters.page,
      limit: filters.limit,
      numItems: count,
      numPages,
    };

    return {
      data: users,
      meta,
    };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('users/addresses/:id')
  async findById(@Param('id') id: number) {
    const address = await this.addressesService.findById(id);
    if (!address) throw new NotFoundException();
    return { data: address };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users/addresses/:id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateUserDto,
    @User() currentUser,
  ) {
    if (id !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();

    if (currentUser?.role !== 'admin' && (payload.email || payload.role))
      throw new ForbiddenException();
    const address = await this.addressesService.findById(id);
    if (!address) throw new NotFoundException();
    await this.addressesService.updateById(id, payload);

    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/addresses/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const address = await this.addressesService.findById(id);
    if (!address) throw new NotFoundException();
    await this.addressesService.deleteById(id);
    return;
  }
}
