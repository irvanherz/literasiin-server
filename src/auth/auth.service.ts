import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment-timezone';
import { Identity } from 'src/users/entities/identity.entity';
import { PasswordResetToken } from 'src/users/entities/password-reset-token.entity';
import { UserDevice } from 'src/users/entities/user-device.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private jwtService: JwtService,
    private usersService: UsersService,
    @InjectRepository(PasswordResetToken)
    private prtRepo: Repository<PasswordResetToken>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(Identity)
    private identitiesRepo: Repository<Identity>,
    @InjectRepository(UserDevice)
    private readonly deviceRepo: Repository<UserDevice>,
  ) {}

  async signin(user: any) {
    const token = this.jwtService.sign({ ...user }, { expiresIn: '5m' });
    const refreshToken = this.jwtService.sign({ ...user }, { expiresIn: '5d' });
    return {
      token,
      refreshToken,
    };
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const user = await this.jwtService.verifyAsync(refreshToken);
      return user;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async signout(payload: any) {
    console.log(payload);
  }

  async signupWithEmail(signupDto: SignupWithEmailDto) {
    const { password, ...createUserDto } = signupDto;

    const user = this.usersRepo.create({
      ...createUserDto,
      role: 'user',
    });
    const key = await bcrypt.hash(password, 5);
    const identity = this.identitiesRepo.create({
      type: 'password',
      userId: user.id,
      key,
    });
    let createdUser: User = null;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const created = await queryRunner.manager.save<User>(user);
      identity.userId = created.id;
      await queryRunner.manager.save<Identity>(identity);
      await queryRunner.commitTransaction();
      createdUser = created;
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    if (!createdUser) throw new InternalServerErrorException();
    return createdUser;
  }

  async saveDevice(payload: any) {
    const result = await this.deviceRepo.upsert(payload, [
      'userId',
      'deviceId',
    ]);
    return {
      ...payload,
      ...result.generatedMaps?.[0],
    };
  }

  async createPasswordResetToken(user: User) {
    const token = uuid.v4();
    const expiredAt = moment().add(10, 'minutes').toDate();
    const prt = await this.prtRepo.save({ userId: user.id, token, expiredAt });
    return prt;
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { token, password } = payload;
    console.log(payload);

    const prt = await this.prtRepo.findOne({ where: { token } });
    console.log(prt);
    if (!prt) throw new NotFoundException();
    const identity = await this.identitiesRepo.findOne({
      where: { userId: prt.userId, type: 'password' },
    });
    if (!identity) throw new NotFoundException();
    const key = await bcrypt.hash(password, 5);
    await this.identitiesRepo.update(identity.id, { key });
    await this.prtRepo.delete(prt.id);
    return true;
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByEmailOrUsername(username);
    if (!user) return null;
    const identity = await this.identitiesRepo.findOne({
      where: { userId: user.id, type: 'password' },
    });
    if (!identity) return null;
    const match = await bcrypt.compare(password, identity.key);
    if (!match) return null;
    return user;
  }
}
