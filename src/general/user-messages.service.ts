import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Like, Repository } from 'typeorm';
import { FindUserMessageFilter } from './dto/user-messages.dto';
import { UserMessage } from './entities/user-message.entity';

@Injectable()
export class UserMessagesService {
  constructor(
    @InjectRepository(UserMessage)
    private messagesRepo: Repository<UserMessage>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async create(payload: Partial<UserMessage>) {
    const kb = this.messagesRepo.create(payload);
    return await this.messagesRepo.save(kb);
  }

  async findMany(filter: FindUserMessageFilter) {
    const take = filter.limit;
    const skip = (filter.page - 1) * take;
    const result = await this.messagesRepo.findAndCount({
      where: {
        message: filter.search ? Like(`%${filter.search}%`) : undefined,
        email: filter.email || undefined,
      },
      skip,
      take,
      order: { [filter.sortBy]: filter.sortOrder },
    });
    return result;
  }

  async findById(id: number) {
    const result = await this.messagesRepo.findOne({
      where: { id },
    });
    return result;
  }

  async deleteById(id: number) {
    const result = await this.messagesRepo.delete(id);
    return result.affected;
  }

  async verifyCaptcha(token: string) {
    const params = new URLSearchParams();
    params.append(
      'secret',
      this.configService.get<string>('GOOGLE_RECAPTCHA_SERVER_KEY'),
    );
    params.append('response', token);
    const { data } = await firstValueFrom(
      this.httpService.post<any>(
        `https://www.google.com/recaptcha/api/siteverify`,
        params,
      ),
    );
    return data?.success === true;
  }
}
