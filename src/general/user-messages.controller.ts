import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import {
  CreateUserMessageDto,
  FindUserMessageFilter,
} from './dto/user-messages.dto';
import { UserMessagesService } from './user-messages.service';

@Controller('general')
export class UserMessagesController {
  constructor(private readonly messagesService: UserMessagesService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post('user-messages')
  async create(@Body() payload: CreateUserMessageDto, @User() currentUser) {
    if (currentUser?.role !== 'admin' && !payload?.captchaToken)
      throw new ForbiddenException();
    if (payload?.captchaToken) {
      const ok = await this.messagesService.verifyCaptcha(payload.captchaToken);
      if (!ok) throw new BadRequestException('Invalid captcha');
    }
    const data = await this.messagesService.create(payload);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-messages')
  async findMany(@Query() filter: FindUserMessageFilter, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const [data, count] = await this.messagesService.findMany(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };
    return { data, meta };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-messages/:id')
  async findById(@Param('id') id: number, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const kb = await this.messagesService.findById(id);
    if (!kb) throw new NotFoundException();
    return { data: kb };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('user-messages/:id')
  async deleteById(@Param('id') id: number, @User() currentUser: any) {
    if (currentUser?.role !== 'admin') throw new ForbiddenException();
    const kb = await this.messagesService.findById(id);
    if (!kb) throw new NotFoundException();
    await this.messagesService.deleteById(id);
    return;
  }
}
