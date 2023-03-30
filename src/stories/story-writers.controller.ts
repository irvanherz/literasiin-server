import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { sanitizeFilter } from 'src/libs/validations';
import { CreateStoryWriterDto } from './dto/create-story-writer.dto';
import { StoryWriterFilterDto } from './dto/story-writer-filter.dto';
import { StoryWriterInvitationFilterDto } from './dto/story-writer-invitation-filter.dto';
import { StoryWritersService } from './story-writers.service';

@Controller('/stories/writers')
export class StoryWritersController {
  constructor(private readonly writersService: StoryWritersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('invitations')
  async findManyInvitations(
    @Query() filter: StoryWriterInvitationFilterDto,
    @User() currentUser: any,
  ) {
    filter.status = sanitizeFilter(filter.status);
    filter.storyId = sanitizeFilter(filter.storyId);
    filter.userId = sanitizeFilter(filter.userId, { currentUser });

    const [data, numItems] = await this.writersService.findManyInvitations(
      filter,
    );
    const meta = { numItems };
    return { data, meta };
  }

  @UseGuards(JwtAuthGuard)
  @Post('invitations/:invitationId/accept')
  async acceptInvitation(
    @Param('invitationId') invitationId: number,
    @User() currentUser: any,
  ) {
    await this.writersService.acceptInvitation(invitationId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('invitations/:invitationId/reject')
  async rejectInvitation(
    @Param('invitationId') invitationId: number,
    @User() currentUser: any,
  ) {
    await this.writersService.rejectInvitation(invitationId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateStoryWriterDto) {
    return await this.writersService.create(payload);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findMany(
    @Query() filter: StoryWriterFilterDto,
    @User() currentUser: any,
  ) {
    (filter.storyId = sanitizeFilter(filter.storyId)), { toNumber: true };
    filter.userId = sanitizeFilter(filter.userId, { currentUser });
    const [data, count] = await this.writersService.findMany(filter);
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const writer = await this.writersService.findById(id);
    if (!writer) throw new NotFoundException();
    return { data: writer };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const writer = await this.writersService.findById(id);
    if (!writer) throw new NotFoundException();
    await this.writersService.deleteById(id);
    return;
  }
}
