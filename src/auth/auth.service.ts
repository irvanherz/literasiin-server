import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IdentitiesService } from 'src/users/identities.service';
import { UsersService } from 'src/users/users.service';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private identitiesService: IdentitiesService,
  ) {}

  async signin(user: any) {
    const token = this.jwtService.sign({ ...user });
    const refreshToken = this.jwtService.sign(
      { user: { id: user.id } },
      { expiresIn: '1d' },
    );
    return {
      token,
      refreshToken,
    };
  }

  async signupWithEmail(signupDto: SignupWithEmailDto) {
    const { password, ...createUserDto } = signupDto;

    const user = await this.usersService.create(createUserDto);
    const key = await bcrypt.hash(password, 5);
    await this.identitiesService.create({
      type: 'email',
      userId: user.id,
      key,
    });
    return user;
  }

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByEmail(username);
    if (!user) return null;
    const identity = await this.identitiesService.findOne({
      userId: user.id,
      type: 'email',
    });
    if (!identity) return null;
    const match = await bcrypt.compare(password, identity.key);
    if (!match) return null;
    return user;
  }
}
