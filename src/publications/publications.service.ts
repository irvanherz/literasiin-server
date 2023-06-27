import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigurationsService } from 'src/configurations/configurations.service';
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
    private readonly publicationsRepository: Repository<Publication>,
    private readonly biteshipService: BiteshipService,
    private readonly configurationsService: ConfigurationsService,
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

  private buildBiteshipPayload(pub: Publication, config: any) {
    if (pub.type === 'indie') {
      const packageId = pub.meta.packageId as keyof typeof this.packages;
      const packageConfig = config.indiePublishingPackages.find(
        (pkg) => pkg.id === packageId,
      );
      const weight = packageConfig.packageWeight;
      return {
        origin_postal_code: config.publisherAddress.postalCode,
        origin_latitude: config.publisherAddress.coordinate.latitude,
        origin_longitude: config.publisherAddress.coordinate.longitude,
        destination_postal_code: pub.address.postalCode,
        couriers: config.supportedCourierCodes.join(','),
        items: [
          {
            name: `Indie Publishing (${packageConfig.name})`,
            quantity: 1,
            value: packageConfig.price,
            weight: weight,
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
        origin_postal_code: config.publisherAddress.postalCode,
        origin_latitude: config.publisherAddress.coordinate.latitude,
        origin_longitude: config.publisherAddress.coordinate.longitude,
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
    throw new BadRequestException('Invalid publication type');
  }

  async queryCourierRates(pub: Publication, config?: any) {
    if (!pub) throw new BadRequestException('Publication does not exist');
    if (!pub.address) throw new BadRequestException('Address has not been set');
    if (!config) {
      const configData = await this.configurationsService.findByName(
        'publication-config',
      );
      config = configData.value;
    }

    const payload = this.buildBiteshipPayload(pub, config);

    const response = await this.biteshipService.queryCourierRates(
      payload as any,
    );
    return response;
  }

  private async queryShippingInfo(pub: Publication, config: any) {
    const { courier_code, courier_service_code } = pub.meta?.shipping || {};
    const info = await this.queryCourierRates(pub, config);
    const shipping = info.pricing.find(
      (c) =>
        c.courier_code === courier_code &&
        c.courier_service_code === courier_service_code,
    );
    return shipping;
  }

  async calculatePayment(pub: Publication) {
    const config = await this.configurationsService.findByName(
      'publication-config',
    );
    const publicationConfig = config.value;

    if (pub.type == 'indie') {
      const packageId = pub.meta.packageId as keyof typeof this.packages;
      const packageConfig = publicationConfig.indiePublishingPackages.find(
        (pkg) => pkg.id === packageId,
      );
      const shipping = await this.queryShippingInfo(pub, publicationConfig);
      const shippingFee = shipping.price;
      const finalAmount = packageConfig.price + shippingFee;
      return {
        totalPrice: finalAmount,
        breakdown: [
          {
            name: `Indie Publishing (${packageConfig.name})`,
            qty: 1,
            unitPrice: packageConfig.price,
            totalPrice: packageConfig.price,
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
            meta: {
              id: pub.id,
              name: `Indie Publishing (${packageConfig.name})`,
              price: packageConfig.price,
            },
            unitPrice: packageConfig.price,
            amount: packageConfig.price,
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
      const { numBwPages, numColorPages, numCopies, paperType } = pub.meta;
      const paperTypeConfig = publicationConfig.paperTypes.find(
        (paper) => paper.id === paperType,
      );
      const bwPagePrice = paperTypeConfig.bwPageUnitPrice;
      const colorPagePrice = paperTypeConfig.colorPageUnitPrice;
      const unitPrice =
        numBwPages * bwPagePrice + numColorPages * colorPagePrice;
      const totalPrice = unitPrice * numCopies;
      const shipping = await this.queryShippingInfo(pub, publicationConfig);
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
