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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateUserDto, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const user = await this.usersService.create(payload);
    return { data: user };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findMany(@Query() filters: UserFiltersDto) {
    const [users, count] = await this.usersService.findMany(filters);
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
  @Get(':id')
  async findById(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException();
    return { data: user };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('username/:username')
  async findByUsername(
    @Param('username') username: string,
    @User() currentUser,
  ) {
    if (username === 'me') username = currentUser.username;
    const user = await this.usersService.findByUsername(username);
    if (!user) throw new NotFoundException();
    return { data: user };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException();
    return { data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateUserDto,
    @User() currentUser,
  ) {
    if (id !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    console.log(payload);

    if (currentUser?.role !== 'admin' && (payload.email || payload.role))
      throw new ForbiddenException();
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException();
    await this.usersService.updateById(id, payload);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const user = await this.usersService.findById(id);
    if (!user) throw new NotFoundException();
    return this.usersService.deleteById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/follow')
  async followUser(@Param('userId') followingId, @User() currentUser) {
    const followerId = currentUser.id;
    await this.usersService.followUser(followerId, followingId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':userId/unfollow')
  async unfollowUser(@Param('userId') followingId, @User() currentUser) {
    const followerId = currentUser.id;
    await this.usersService.unfollowUser(followerId, followingId);
  }

  @Get(':userId/following')
  async findManyFollowing(@Param('userId') userId: number) {
    return await this.usersService.findManyFollowing(userId);
  }

  @Get(':userId/followers')
  async findManyFollowers(@Param('userId') userId: number) {
    return await this.usersService.findManyFollowers(userId);
  }
}
