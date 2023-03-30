import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { StoryWriterFilterDto } from './dto/story-writer-filter.dto';
import { StoryWriterInvitationFilterDto } from './dto/story-writer-invitation-filter.dto';
import { StoryWriter } from './entities/story-writer';
@Injectable()
export class StoryWritersService {
  constructor(
    @InjectRepository(StoryWriter)
    private writersRepo: Repository<StoryWriter>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async create(payload: Partial<StoryWriter>) {
    const writer = this.writersRepo.create(payload);
    return await this.writersRepo.save(writer);
  }

  async findMany(filter: StoryWriterFilterDto) {
    const take = filter.limit || 1;
    const skip = (filter.page - 1) * take;
    let query = await this.usersRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.photo', 'photo')
      .leftJoinAndMapOne('user.meta', 'story_writer', 'sw', 'sw.userId=user.id')
      .leftJoin('story', 's', 's.id=sw.storyId');

    if (filter.storyId)
      query = query.andWhere('sw.storyId=:storyId', {
        storyId: filter.storyId,
      });
    if (filter.userId)
      query = query.andWhere('sw.userId=:userId', { userId: filter.userId });

    const result = query.skip(skip).take(take).getManyAndCount();
    return result;
  }

  async findById(id: number) {
    const result = await this.writersRepo.findOne({ where: { id } });
    return result;
  }

  async deleteById(id: number) {
    const result = await this.writersRepo.delete(id);
    return result.affected;
  }

  async findManyInvitations(filter: StoryWriterInvitationFilterDto) {
    console.log(filter);

    const take = filter.limit || 100;
    const skip = (filter.page - 1) * take;
    let query = await this.writersRepo
      .createQueryBuilder('invitation')
      .leftJoinAndSelect('invitation.user', 'user')
      .leftJoinAndSelect('invitation.story', 'story')
      .where("invitation.role != 'owner'");

    if (filter.storyId)
      query = query.andWhere('invitation.storyId=:storyId', {
        storyId: filter.storyId,
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
    const result = await this.writersRepo.save({
      id: invitationId,
      status: 'approved',
    });
    return result;
  }

  async rejectInvitation(invitationId: number) {
    const result = await this.writersRepo.save({
      id: invitationId,
      status: 'rejected',
    });
    return result;
  }
}
