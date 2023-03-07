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
import { ConfigurationsService } from './configurations.service';
import { ConfigurationFiltersDto } from './dto/configuration-filters.dto';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller('configurations')
export class ConfigurationsController {
  constructor(private readonly configurationsService: ConfigurationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateConfigurationDto, @User() currentUser) {
    if (currentUser.role !== 'admin') throw new ForbiddenException();
    return this.configurationsService.create(payload);
  }

  @Get()
  async findMany(@Query() filters: ConfigurationFiltersDto) {
    const [data, count] = await this.configurationsService.findByQuery(filters);
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const config = await this.configurationsService.findById(id);
    if (!config) throw new NotFoundException();
    return { data: config };
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string) {
    const config = await this.configurationsService.findByName(name);
    if (!config) throw new NotFoundException();
    return { data: config };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdateConfigurationDto,
    @User() currentUser,
  ) {
    if (currentUser.role !== 'admin') throw new ForbiddenException();
    const config = await this.configurationsService.findById(id);
    if (!config) throw new NotFoundException();
    await this.configurationsService.updateById(id, payload);
    return;
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @User() currentUser) {
    const config = await this.configurationsService.findById(id);
    if (currentUser.role !== 'admin') throw new ForbiddenException();
    if (!config) throw new NotFoundException();
    await this.configurationsService.deleteById(id);
    return;
  }
}
