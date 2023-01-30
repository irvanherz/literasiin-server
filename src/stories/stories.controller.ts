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
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoriesService } from './stories.service';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createStoryDto: CreateStoryDto, @Request() req) {
    const user = req.user;
    console.log('OKE', user);

    createStoryDto.userId = user.id;
    return await this.storiesService.create(createStoryDto);
  }

  @Get()
  async findMany() {
    const [data, count] = await this.storiesService.findMany();
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    return { data: story };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() updateStoryDto: UpdateStoryDto,
    @Request() req,
  ) {
    const user = req.user;

    const story = await this.storiesService.findById(id);
    if (!story) throw new NotFoundException();
    if (user.id !== story.userId) throw new ForbiddenException();

    await this.storiesService.updateById(id, updateStoryDto);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number, @Request() req) {
    const story = await this.storiesService.findById(id);
    const user = req.user;
    if (!story) throw new NotFoundException();
    if (user.id !== story.userId) throw new ForbiddenException();
    await this.storiesService.deleteById(id);
    return;
  }
}
