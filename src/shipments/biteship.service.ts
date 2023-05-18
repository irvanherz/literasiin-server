import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { QueryCourierRatesDto } from './dto/biteship.dto';

@Injectable()
export class BiteshipService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = configService.get<string>('BITESHIP_BASEURL');
    this.apiKey = configService.get<string>('BITESHIP_APIKEY');
  }

  baseUrl = '';
  apiKey = '';

  async queryCouriers() {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<any>(`${this.baseUrl}/couriers`, {
          headers: { Authorization: this.apiKey },
        }),
      );
      return data;
    } catch (err) {
      if (err?.response?.data) return err.response.data;
      throw err;
    }
  }

  async queryCourierRates(payload: QueryCourierRatesDto) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<any>(`${this.baseUrl}/rates/couriers`, payload, {
          headers: { Authorization: this.apiKey },
        }),
      );
      return data;
    } catch (err) {
      if (err?.response?.data) return err.response.data;
      throw err;
    }
  }
}
