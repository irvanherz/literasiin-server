import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BiteshipService } from 'src/shipments/biteship.service';
import { ILike, Repository } from 'typeorm';
import {
  PublicationDetailOptions,
  PublicationFilterDto,
} from './dto/publications.dto';
import { Publication } from './entities/publication.entity';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(Publication)
    private publicationsRepository: Repository<Publication>,
    private biteshipService: BiteshipService,
  ) {}

  async create(payload: Partial<Publication>) {
    const user = this.publicationsRepository.create(payload);
    const result = await this.publicationsRepository.save(user);
    return result;
  }

  async findMany(filter: PublicationFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    const result = this.publicationsRepository.findAndCount({
      where: {
        userId: filter.userId ? (filter.userId as any) : undefined,
        title: filter.search ? ILike(filter.search) : undefined,
        status: filter.status ? (filter.status as any) : undefined,
      },
      relations: filter.includeAddress ? { address: true } : undefined,
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number, options: PublicationDetailOptions = {}) {
    const result = this.publicationsRepository.findOne({
      where: { id },
      relations: options.includeAddress ? { address: true } : undefined,
    });
    return result;
  }

  async updateById(id: number, payload: Partial<Publication>) {
    const result = await this.publicationsRepository.update(id, payload);
    return result.affected;
  }

  async deleteById(id: number) {
    const result = await this.publicationsRepository.softDelete(id);
    return result.affected;
  }

  async save(payload: Partial<Publication>) {
    const result = await this.publicationsRepository.save(payload);
    return result;
  }

  async pay(id: number) {
    const pub = await this.publicationsRepository.findOne({ where: { id } });
    pub.status = 'payment';
    await this.publicationsRepository.save(pub);
  }

  packages = {
    silver: {
      name: 'Silver Package',
      price: 500000,
    },
    gold: {
      name: 'Gold Package',
      price: 750000,
    },
    platinum: {
      name: 'Platinum Package',
      price: 1000000,
    },
  };

  private buildBiteshipPayload(pub: Publication) {
    if (pub.type === 'indie') {
      const packageId = pub.meta.packageId as keyof typeof this.packages;
      const pkg = this.packages[packageId];
      return {
        origin_postal_code: 65115,
        destination_postal_code: pub.address.postalCode,
        couriers: 'jne,jnt,sicepat,wahana',
        items: [
          {
            name: 'Indie Publishing',
            quantity: 1,
            value: pkg.price,
            weight: 1000,
          },
        ],
      };
    } else if (pub.type === 'selfpub') {
      const { numBwPages, numColorPages, numCopies } = pub.meta;
      const bwPagePrice = 100;
      const colorPagePrice = 300;
      const weight = Math.ceil((pub.meta.numCopies / 3) * 1000);
      const unitPrice =
        numBwPages * bwPagePrice + numColorPages * colorPagePrice;
      const totalPrice = unitPrice * numCopies;
      return {
        origin_postal_code: 65115,
        destination_postal_code: pub.address.postalCode,
        couriers: 'jne',
        items: [
          {
            name: 'Self Publishing',
            quantity: 1,
            value: totalPrice,
            weight,
          },
        ],
      };
    }
    throw new Error('Invalid publication type');
  }

  async queryCourierRates(pub: Publication) {
    if (!pub) throw new Error('Publication does not exist');
    if (!pub.address) throw new Error('Address has not been set');
    const payload = this.buildBiteshipPayload(pub);

    const response = await this.biteshipService.queryCourierRates(
      payload as any,
    );
    return response;
  }

  private async queryShippingInfo(pub: Publication) {
    const { courier_code, courier_service_code } = pub.meta?.shipping || {};
    const info = await this.queryCourierRates(pub);
    const shipping = info.pricing.find(
      (c) =>
        c.courier_code === courier_code &&
        c.courier_service_code === courier_service_code,
    );
    return shipping;
  }

  async calculatePayment(pub: Publication) {
    if (pub.type == 'indie') {
      const packageId = pub.meta.packageId as keyof typeof this.packages;
      const pkg = this.packages[packageId];
      const shipping = await this.queryShippingInfo(pub);
      const shippingFee = shipping.price;
      const finalAmount = pkg.price + shippingFee;
      return {
        totalPrice: finalAmount,
        breakdown: [
          {
            name: pkg.name,
            qty: 1,
            unitPrice: pkg.price,
            totalPrice: pkg.price,
          },
          {
            name: 'Shipping',
            qty: 1,
            unitPrice: shippingFee,
            totalPrice: shippingFee,
          },
        ],
        orderDetails: [
          {
            qty: 1,
            type: 'publication',
            meta: { id: pub.id, name: 'Publishing', price: pkg.price },
            unitPrice: pkg.price,
            amount: pkg.price,
          },
          {
            qty: 1,
            type: 'shipping-fee',
            meta: {},
            unitPrice: shippingFee,
            amount: shippingFee,
          },
        ],
      };
    } else if (pub.type == 'selfpub') {
      const { numBwPages, numColorPages, numCopies } = pub.meta;
      const bwPagePrice = 100;
      const colorPagePrice = 300;
      const unitPrice =
        numBwPages * bwPagePrice + numColorPages * colorPagePrice;
      const totalPrice = unitPrice * numCopies;
      const shipping = await this.queryShippingInfo(pub);
      const shippingFee = shipping.price;
      const finalPrice = totalPrice + shippingFee;
      return {
        totalPrice: finalPrice,
        breakdown: [
          {
            name: 'Publishing',
            qty: numCopies,
            unitPrice,
            totalPrice,
          },
          {
            name: 'Shipping',
            qty: 1,
            unitPrice: shippingFee,
            totalPrice: shippingFee,
          },
        ],
        orderDetails: [
          {
            qty: numCopies,
            type: 'publication',
            meta: { id: pub.id, name: 'Publishing', price: unitPrice },
            unitPrice: unitPrice,
            amount: totalPrice,
          },
          {
            qty: 1,
            type: 'shipping-fee',
            meta: {},
            unitPrice: shippingFee,
            amount: shippingFee,
          },
        ],
      };
    }
  }
}
