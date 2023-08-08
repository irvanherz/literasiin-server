import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
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
import {
  CreateStorytellingAuthorDto,
  StorytellingAuthorFilter,
  StorytellingAuthorInvitationFilter,
} from './dto/storytelling-authors.dto';
import { StorytellingAuthorsService } from './storytelling-authors.service';

@Controller('/storytellings/authors')
export class StorytellingAuthorsController {
  constructor(
    private readonly authorsService: StorytellingAuthorsService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('invitations')
  async findManyInvitations(
    @Query() filter: StorytellingAuthorInvitationFilter,
    @User() currentUser: any,
  ) {
    filter.status = sanitizeFilter(filter.status);
    filter.storytellingId = sanitizeFilter(filter.storytellingId);
    filter.userId = sanitizeFilter(filter.userId, { currentUser });

    const [data, numItems] = await this.authorsService.findManyInvitations(
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
    await this.authorsService.acceptInvitation(invitationId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('invitations/:invitationId/reject')
  async rejectInvitation(
    @Param('invitationId') invitationId: number,
    @User() currentUser: any,
  ) {
    await this.authorsService.rejectInvitation(invitationId);
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreateStorytellingAuthorDto) {
    const invitation = await this.authorsService.create(payload);
    this.amqpConnection.publish(
      'storytellings.authors.invitations.created',
      '',
      {
        invitation,
      },
    );
    return { data: invitation };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findMany(
    @Query() filter: StorytellingAuthorFilter,
    @User() currentUser: any,
  ) {
    (filter.storytellingId = sanitizeFilter(filter.storytellingId)),
      { toNumber: true };
    filter.userId = sanitizeFilter(filter.userId, { currentUser });
    const [data, count] = await this.authorsService.findMany(filter);
    const meta = {
      numItems: count,
    };
    return { data, meta };
  }

  @Get(':id')
  async findById(@Param('id') id: number) {
    const author = await this.authorsService.findById(id);
    if (!author) throw new NotFoundException();
    return { data: author };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const author = await this.authorsService.findById(id);
    if (!author) throw new NotFoundException();
    await this.authorsService.deleteById(id);
    return;
  }
}
