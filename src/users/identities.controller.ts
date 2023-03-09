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
import { User } from 'src/auth/user.decorator';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { IdentityFiltersDto } from './dto/identity-filters.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';
import { IdentitiesService } from './identities.service';

@Controller('users')
export class IdentitiesController {
  constructor(private readonly identitiesService: IdentitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Get(['identities', ':userId/identities'])
  async findMany(
    @Query() filters: IdentityFiltersDto,
    @Param() param: any,
    @User() currentUser,
  ) {
    if (param?.userId) filters.userId = param.userId;
    if (filters.userId !== currentUser.id && currentUser.role !== 'admin')
      throw new ForbiddenException();

    const [identities, count] = await this.identitiesService.findMany(filters);
    const numPages = Math.ceil(count / filters.limit);
    const meta = {
      page: filters.page,
      limit: filters.limit,
      numItems: count,
      numPages,
    };

    return {
      data: identities,
      meta,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('identities')
  async create(@Body() payload: CreateIdentityDto) {
    const identity = await this.identitiesService.create(payload);
    return { data: identity };
  }

  @UseGuards(JwtAuthGuard)
  @Get('identities/:id')
  async findById(@Param('id') id: number) {
    const identity = await this.identitiesService.findById(id);
    if (!identity) throw new NotFoundException();
    return { data: identity };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('identities/:id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateIdentityDto,
    @User() currentUser,
  ) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const identity = await this.identitiesService.findById(id);
    if (!identity) throw new NotFoundException();
    await this.identitiesService.updateById(id, payload);
    return true;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('identities/:id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const identity = await this.identitiesService.findById(id);
    if (!identity) throw new NotFoundException();
    return this.identitiesService.deleteById(id);
  }
}
