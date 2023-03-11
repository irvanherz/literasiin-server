import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { WalletFilterDto } from './dto/wallet-filter';
import { WalletsService } from './wallets.service';

function sanitizeFilter(value: any, options: any) {
  if (value === 'me') return options?.currentUser?.id;
  if (value === 'any') return undefined;
  return value;
}

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findByQuery(@Query() filter: WalletFilterDto, @User() currentUser) {
    filter.userId = sanitizeFilter(filter.userId, { currentUser });

    if (
      (filter.userId == undefined || filter.userId !== currentUser.id) &&
      currentUser.role !== 'admin'
    )
      throw new BadRequestException();

    const [wallets, count] = await this.walletsService.findByQuery(filter);
    const numPages = Math.ceil(count / filter.limit);
    const meta = {
      page: filter.page,
      limit: filter.limit,
      numItems: count,
      numPages,
    };

    return {
      data: wallets,
      meta,
    };
  }
}
