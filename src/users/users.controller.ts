import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findMany() {
    return this.usersService.findMany();
  }
  @Get('/:id')
  async findById(@Param('id') id: number) {
    return this.usersService.findById(id);
  }
}
