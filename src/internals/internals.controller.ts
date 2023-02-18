import { Controller } from '@nestjs/common';
import { InternalsService } from './internals.service';

@Controller('internals')
export class InternalsController {
  constructor(private readonly internalsService: InternalsService) {}
}
