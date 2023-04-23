import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectQueue } from '@nestjs/bull';
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
import { Queue } from 'bull';
import { OAuth2Client } from 'google-auth-library';
import { MailsService } from 'src/notifications/mails.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthWithGoogleDto } from './dto/auth-with-google.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SigninDto } from './dto/sigin.dto';
import { SignOutDto } from './dto/signout.dto';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { User } from './user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private readonly authService: AuthService,
    private readonly mailsSevice: MailsService,
    private readonly configsService: ConfigService,
    @InjectQueue('mails')
    private readonly mailsQueue: Queue,
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
      return {
        data: user,
        meta: {
          token: auth.token,
          refreshToken: auth.refreshToken,
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
    return {
      data: user,
      meta: {
        token: auth.token,
        refreshToken: auth.refreshToken,
        device,
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

  @Post('/logout')
  async logout(@Body() body: SignOutDto) {
    await this.authService.signout(body);
    // if (!ok) throw new NotFoundException();
    return;
  }

  @Post('/google')
  async authWithGoogle(@Body() body: AuthWithGoogleDto) {
    const clientKey = this.configsService.get<string>('GOOGLE_OAUTH_CLIENT_ID');
    const clientSecret = this.configsService.get<string>(
      'GOOGLE_OAUTH_CLIENT_SECRET',
    );
    const client = new OAuth2Client(clientKey, clientSecret);
    const ticket = await client.verifyIdToken({
      idToken: body.idToken,
      audience: clientKey,
    });
    const payload = ticket.getPayload();

    const [user, isNewUser] = await this.authService.validateUserWithGoogle(
      payload,
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
    return {
      data: user,
      meta: {
        token: auth.token,
        refreshToken: auth.refreshToken,
        device,
      },
    };
  }

  // @UseGuards(GoogleAuthGuard)
  // @Get('/google')
  // continueWithGoogle(@Request() req) {
  //   console.log('login', req.user);
  //   return this.authService.signin({ id: 1, name: 'Kucing' });
  // }

  // @UseGuards(GoogleAuthGuard)
  // @Get('/google/redirect')
  // async continueWithGoogleRedirect() {
  //   const data = await this.authService.signin({ id: 1, name: 'Kucing' });
  //   const jsonData = JSON.stringify(data);

  //   return `
  //     <!DOCTYPE html>
  //     <html>
  //     <script>
  //       const data = ${jsonData};
  //       window.opener.postMessage({ type: 'google-auth-completed', data: data }, '*');
  //       window.close();
  //     </script>
  //     </body>

  //     </html>
  //   `;
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    console.log('A', req.user);

    return req.user;
  }
}
