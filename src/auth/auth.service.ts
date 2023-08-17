import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { TokenPayload } from 'google-auth-library';
import * as moment from 'moment-timezone';
import { Identity } from 'src/users/entities/identity.entity';
import { PasswordResetToken } from 'src/users/entities/password-reset-token.entity';
import { UserDevice } from 'src/users/entities/user-device.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import {
  ChangePasswordDto,
  ResetPasswordDto,
  SignupWithEmailDto,
} from './dto/auth.dto';

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
    @InjectRepository(Wallet)
    private walletsRepo: Repository<Wallet>,
  ) {}

  async signin(user: any) {
    const token = this.jwtService.sign({ ...user }, { expiresIn: '5m' });
    const refreshToken = this.jwtService.sign({ ...user }, { expiresIn: '5d' });
    const expiredAt = dayjs().add(1, 'minutes').toDate();
    return {
      token,
      refreshToken,
      expiredAt,
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

    const key = await bcrypt.hash(password, 5);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const userP = this.usersRepo.create({
        ...createUserDto,
        role: 'user',
      });
      const user = await queryRunner.manager.save(User, userP);
      const identityP = this.identitiesRepo.create({
        type: 'password',
        userId: user.id,
        key,
      });
      await queryRunner.manager.save(Identity, identityP);
      const walletP = this.walletsRepo.create({ userId: user.id });
      await queryRunner.manager.save(Wallet, walletP);
      await queryRunner.commitTransaction();
      return user;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
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
    const userId = user.id;
    const prt = await this.prtRepo.findOne({
      where: { userId },
      order: { createdAt: 'desc' },
    });
    //exist and not expired?
    if (prt && moment(prt.expiredAt).isAfter(moment())) {
      const expiredAt = moment().add(10, 'minutes').toDate();
      prt.expiredAt = expiredAt;
      const result = await this.prtRepo.save(prt);
      return result;
    }
    // expired or not exist
    else {
      const token = uuid.v4();
      const expiredAt = moment().add(10, 'minutes').toDate();
      const result = await this.prtRepo.save({
        userId: user.id,
        token,
        expiredAt,
      });
      return result;
    }
  }

  async resetPassword(payload: ResetPasswordDto) {
    const { email, token, password } = payload;

    const prt = await this.prtRepo.findOne({
      where: { token, user: { email } },
    });
    if (!prt) throw new BadRequestException('Invalid password reset token');
    if (moment(prt.expiredAt).isBefore(moment()))
      throw new BadRequestException('Password reset token has expired');
    const identity = await this.identitiesRepo.findOne({
      where: { userId: prt.userId, type: 'password' },
    });
    const key = await bcrypt.hash(password, 5);
    if (!identity) {
      const result = await this.identitiesRepo.save({
        userId: prt.userId,
        type: 'password',
        key,
      });
      prt.expiredAt = moment().toDate();
      await this.prtRepo.save(prt);
      return result;
    } else {
      identity.key = key;
      const result = await this.identitiesRepo.save(identity);
      prt.expiredAt = moment().toDate();
      await this.prtRepo.save(prt);
      return result;
    }
  }

  async changePassword(payload: ChangePasswordDto) {
    const identity = await this.identitiesRepo.findOne({
      where: { userId: payload.userId as any, type: 'password' },
    });
    if (!identity) throw new BadRequestException('Invalid credential');
    const matched = await bcrypt.compare(payload.oldPassword, identity.key);
    const newPassword = await bcrypt.hash(payload.newPassword, 5);
    if (!matched) throw new BadRequestException('Invalid credential');
    identity.key = newPassword;
    const result = await this.identitiesRepo.save(identity);
    return result;
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

  private randomPassword() {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 10) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  private randomUsername() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 7) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return 'user' + result + Date.now().toString();
  }

  async validateUserWithGoogle(payload: TokenPayload) {
    const email = payload.email;
    const sub = payload.sub;
    let identity = await this.identitiesRepo.findOne({
      where: { type: 'google', key: sub },
    });
    let user = await this.usersRepo.findOne({ where: { email } });
    if (identity) {
      if (!user) throw new BadRequestException('User not found');
      if (identity.userId !== user.id)
        throw new BadRequestException(
          'Something went wrong. Please contact customer service',
        );
      return [user, false] as [User, boolean];
    } else {
      if (!user) {
        user = await this.signupWithEmail({
          email,
          fullName: payload?.name || 'User',
          password: this.randomPassword(),
          username: this.randomUsername(),
        } as any);
      }
      identity = await this.identitiesRepo.save({
        type: 'google',
        key: sub,
        userId: user.id,
      });
      return [user, true] as [User, boolean];
    }
  }
}
