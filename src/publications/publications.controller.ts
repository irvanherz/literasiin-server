import {
  BadRequestException,
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
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { OrdersService } from 'src/finances/orders.service';
import { sanitizeFilter } from 'src/libs/validations';
import { ShipmentsService } from 'src/shipments/shipments.service';
import {
  CreatePublicationDto,
  PublicationDetailOptions,
  PublicationFilterDto,
  UpdatePublicationDto,
} from './dto/publications.dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(
    private readonly publicationsService: PublicationsService,
    private readonly ordersService: OrdersService,
    private readonly shipmentsService: ShipmentsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() payload: CreatePublicationDto, @User() currentUser) {
    payload.userId = sanitizeFilter(payload.userId || 'me', { currentUser });
    if (payload.userId !== currentUser?.id && currentUser?.role !== 'admin')
      throw new ForbiddenException();
    const data = await this.publicationsService.create(payload as any);
    return { data };
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async findMany(@Query() filter: PublicationFilterDto, @User() currentUser) {
    filter.userId = sanitizeFilter(filter.userId || 'me', { currentUser });
    filter.status = sanitizeFilter(filter.status);
    const [data, numItems] = await this.publicationsService.findMany(filter);
    const meta = { numItems };
    return { data, meta };
  }

  @Get(':id')
  async findById(
    @Param('id') id: number,
    @Query() options: PublicationDetailOptions,
  ) {
    const pub = await this.publicationsService.findById(id, options);
    if (!pub) throw new NotFoundException();
    return {
      data: pub,
    };
  }

  @Post(':id/calculate-payment')
  async calculatePayment(@Param('id') id: number) {
    const pub = await this.publicationsService.findById(id, {
      includeAddress: true,
    });
    if (!pub) throw new NotFoundException();
    const info = await this.publicationsService.calculatePayment(pub);
    return { data: info };
  }

  @Post(':id/commit')
  async commit(@Param('id') id: number) {
    const pub = await this.publicationsService.findById(id, {
      includeAddress: true,
    });
    if (!pub) throw new NotFoundException();
    if (pub.status !== 'draft')
      return new BadRequestException(
        'This publication cannot proceed to payment',
      );
    //estimate
    const info = await this.publicationsService.calculatePayment(pub);
    const order = await this.ordersService.createWithDetails(
      {
        userId: pub.userId,
        amount: info.totalPrice,
      },
      info.orderDetails as any,
    );
    pub.status = 'payment';
    pub.orderId = order.id;
    const result = await this.publicationsService.save(pub);
    return { data: result };
  }

  @Post(':id/ship')
  async ship(@Param('id') id: number) {
    const pub = await this.publicationsService.findById(id, {
      includeAddress: true,
    });
    if (pub.status !== 'publishing')
      return new BadRequestException(
        'This publication cannot proceed to shipping',
      );
    const shipment = await this.shipmentsService.create({
      status: 'created',
      userId: pub.userId,
    });
    pub.status = 'shipping';
    pub.shipmentId = shipment.id;
    await this.publicationsService.save(pub);
  }

  @Post(':id/available-couriers')
  async queryAvailableCouriers(@Param('id') id: number) {
    const pub = await this.publicationsService.findById(id, {
      includeAddress: true,
    });
    if (!pub) throw new NotFoundException();
    //estimate
    const data = await this.publicationsService.queryCourierRates(pub);
    return { data: data.pricing };
  }

  @Patch(':id')
  async updateById(
    @Param('id') id: number,
    @Body() payload: UpdatePublicationDto,
  ) {
    const result = await this.publicationsService.updateById(
      id,
      payload as any,
    );
    if (!result) throw new NotFoundException();
    return;
  }

  @Delete(':id')
  async deleteById(@Param('id') id: number) {
    const result = this.publicationsService.deleteById(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
