import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { sanitizeFilter } from 'src/libs/validations';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import {
  AuthWithGoogleDto,
  ChangePasswordDto,
  ResetPasswordDto,
  SignOutDto,
  SigninDto,
  SignupWithEmailDto,
  SupportSigninDto,
} from './dto/auth.dto';
import { FacebookAuthGuard } from './facebook-auth.guard';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configsService: ConfigService,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  @Get('test')
  async sdsa() {
    this.amqpConnection.publish('users.created', '', {});
  }

  @Post('/signup')
  async signupWithEmail(@Body() payload: SignupWithEmailDto) {
    try {
      const user = await this.authService.signupWithEmail(payload);
      const auth = await this.authService.signin({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      this.amqpConnection.publish('users.created', '', {
        user,
      });

      const device = await this.authService.saveDevice({
        userId: user.id,
        deviceType: payload?.deviceType || 'other',
        deviceId: payload.deviceId,
        notificationToken: payload?.notificationToken || null,
      });
      await this.usersService.updateLastLoginAt(user.id);
      return {
        data: user,
        meta: {
          ...auth,
          device,
        },
      };
    } catch (err) {
      console.log(err);

      if (err?.code === '23505')
        throw new BadRequestException('Email or username already used');
      throw new InternalServerErrorException();
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(@User() user, @Body() body: SigninDto) {
    const auth = await this.authService.signin({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    const device = await this.authService.saveDevice({
      userId: user.id,
      deviceType: body?.deviceType || 'other',
      deviceId: body.deviceId,
      notificationToken: body?.notificationToken || null,
    });
    await this.usersService.updateLastLoginAt(user.id);
    return {
      data: user,
      meta: {
        ...auth,
        device,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/support/signin')
  async SupportSignIn(@Body() body: SupportSigninDto, @User() currentUser) {
    if (currentUser?.role !== 'admin') throw new BadRequestException();
    const user = await this.usersService.findByEmailOrUsername(body.username);
    const auth = await this.authService.signin({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    return {
      data: user,
      meta: {
        ...auth,
        device: null,
      },
    };
  }

  @Post('/refresh-token')
  async refreshToken(@Body('refreshToken') rtoken: string) {
    const cred = await this.authService.validateRefreshToken(rtoken);
    if (!cred) throw new UnauthorizedException();
    const user = await this.usersService.findById(cred.id);
    if (!user) throw new UnauthorizedException();
    const auth = await this.authService.signin({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    return {
      data: user,
      meta: {
        token: auth.token,
        refreshToken: auth.refreshToken,
      },
    };
  }

  @Post('/reset-password-request')
  async forgotPassword(@Body('username') username) {
    const user = await this.usersService.findByEmailOrUsername(username);
    if (!user) throw new NotFoundException('Invalid email or username');
    const prt = await this.authService.createPasswordResetToken(user);
    if (!prt) throw new BadRequestException();

    this.amqpConnection.publish('users.passwordResetTokens.created', '', {
      user,
      prt,
    });

    return {
      data: { user: { email: user.email } },
    };
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const result = await this.authService.resetPassword(body);
    if (!result) throw new BadRequestException();
    return;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(
    @Body() payload: ChangePasswordDto,
    @User() currentUser,
  ) {
    payload.userId = sanitizeFilter(payload.userId || 'me', { currentUser });
    if (payload.userId !== currentUser.id && currentUser.role !== 'admin')
      throw new BadRequestException();
    const result = await this.authService.changePassword(payload);
    if (!result) throw new BadRequestException();
    return;
  }

  @Post('/signout')
  async logout(@Body() body: SignOutDto) {
    await this.authService.signout(body);
    // if (!ok) throw new NotFoundException();
    return;
  }

  @Post('/with-google')
  async authWithGoogle(@Body() body: AuthWithGoogleDto) {
    const clientKey = this.configsService.get<string>('GOOGLE_OAUTH_CLIENT_ID');
    const clientSecret = this.configsService.get<string>(
      'GOOGLE_OAUTH_CLIENT_SECRET',
    );
    const callbackURL =
      this.configsService.get<string>('APP_BASEURL') + '/auth/google/redirect';
    const client = new OAuth2Client(clientKey, clientSecret, callbackURL);
    const token = await client.getToken(body.code);

    const ticket = await client.verifyIdToken({
      idToken: token.tokens.id_token,
      audience: clientKey,
    });
    const payload = ticket.getPayload();

    const [user, isNewUser] = await this.authService.validateUserWithGoogle(
      payload,
      token,
    );

    if (isNewUser) {
      this.amqpConnection.publish('users.created', '', {
        user,
      });
    }

    const auth = await this.authService.signin({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    const device = await this.authService.saveDevice({
      userId: user.id,
      deviceType: body?.deviceType || 'other',
      deviceId: body.deviceId,
      notificationToken: body?.notificationToken || null,
    });
    await this.usersService.updateLastLoginAt(user.id);
    return {
      data: user,
      meta: {
        token: auth.token,
        refreshToken: auth.refreshToken,
        device,
      },
    };
  }

  @Post('/with-facebook')
  async authWithFacebook(@Body() body: AuthWithGoogleDto) {
    const token = await this.authService.getFacebookAccessTokenFromCode(
      body.code,
    );
    const profile = await this.authService.getFacebookUserData(
      token.access_token,
    );
    const [user, isNewUser] = await this.authService.validateUserWithFacebook(
      profile,
      token,
    );

    if (isNewUser) {
      this.amqpConnection.publish('users.created', '', {
        user,
      });
    }

    const auth = await this.authService.signin({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    const device = await this.authService.saveDevice({
      userId: user.id,
      deviceType: body?.deviceType || 'other',
      deviceId: body.deviceId,
      notificationToken: body?.notificationToken || null,
    });

    await this.usersService.updateLastLoginAt(user.id);
    return {
      data: user,
      meta: {
        token: auth.token,
        refreshToken: auth.refreshToken,
        device,
      },
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  continueWithGoogle() {
    console.log('continueWithGoogle');
  }

  @UseGuards(FacebookAuthGuard)
  @Get('/facebook')
  continueWithFacebook() {
    console.log('continueWithFacebook');
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    return req.user;
  }
}
