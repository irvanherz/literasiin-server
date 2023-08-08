import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  StorytellingAuthorFilter,
  StorytellingAuthorInvitationFilter,
} from './dto/storytelling-authors.dto';
import { StorytellingAuthor } from './entities/storytelling-author.entity';

@Injectable()
export class StorytellingAuthorsService {
  constructor(
    @InjectRepository(StorytellingAuthor)
    private authorsRepo: Repository<StorytellingAuthor>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(payload: Partial<StorytellingAuthor>) {
    const author = this.authorsRepo.create(payload);
    return await this.authorsRepo.save(author);
  }

  async findMany(filter: StorytellingAuthorFilter) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    let query = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.photo', 'photo')
      .leftJoinAndMapOne(
        'user.meta',
        'storytelling_author',
        'sw',
        'sw.userId=user.id',
      )
      .leftJoin('storytelling', 's', 's.id=sw.storytellingId');

    if (filter.storytellingId)
      query = query.andWhere('sw.storytellingId=:storytellingId', {
        storytellingId: filter.storytellingId,
      });
    if (filter.userId)
      query = query.andWhere('sw.userId=:userId', { userId: filter.userId });

    const result = query.skip(skip).take(take).getManyAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.authorsRepo.findOne({ where: { id } });
    return result;
  }

  async deleteById(id: number) {
    const result = await this.authorsRepo.delete(id);
    return result.affected;
  }

  async findManyInvitations(filter: StorytellingAuthorInvitationFilter) {
    console.log(filter);

    const take = filter.limit || 100;
    const skip = (filter.page - 1) * take;
    let query = await this.authorsRepo
      .createQueryBuilder('invitation')
      .leftJoinAndSelect('invitation.user', 'user')
      .leftJoinAndSelect('invitation.storytelling', 'storytelling')
      .where("invitation.role != 'owner'");

    if (filter.storytellingId)
      query = query.andWhere('invitation.storytellingId=:storytellingId', {
        storytellingId: filter.storytellingId,
      });
    if (filter.userId)
      query = query.andWhere('invitation.userId=:userId', {
        userId: filter.userId,
      });
    if (filter.status)
      query = query.andWhere('invitation.status=:status', {
        status: filter.status,
      });

    const result = query.skip(skip).take(take).getManyAndCount();
    return result;
  }

  async acceptInvitation(invitationId: number) {
    const result = await this.authorsRepo.save({
      id: invitationId,
      status: 'approved',
    });
    return result;
  }

  async rejectInvitation(invitationId: number) {
    const result = await this.authorsRepo.save({
      id: invitationId,
      status: 'rejected',
    });
    return result;
  }
}
