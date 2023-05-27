import { Controller } from '@nestjs/common';
import { StorytellingsService } from './storytellings.service';

@Controller('storytellings')
export class StorytellingsController {
  constructor(private readonly storytellingsService: StorytellingsService) {}
}
