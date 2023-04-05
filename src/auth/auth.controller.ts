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
import { Queue } from 'bull';
import { OAuth2Client } from 'google-auth-library';
import { MailsService } from 'src/notifications/mails.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthWithGoogleDto } from './dto/auth-with-google.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
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

  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) throw new NotFoundException();
    const prt = await this.authService.createPasswordResetToken(user);
    if (!prt) throw new NotFoundException();
    this.mailsQueue.add('send', {
      to: user.email,
      template: {
        name: 'reset-password-request',
        parameters: { user, prt: prt },
      },
    });
    // await this.mailsSevice.send({
    //   to: user.email,
    //   template: {
    //     name: 'reset-password-request',
    //     parameters: { user, prt: prt },
    //   },
    // });
    return {
      data: { user, prt },
    };
  }

  @Post('/reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const ok = await this.authService.resetPassword(body);
    if (!ok) throw new NotFoundException();
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
    const client = new OAuth2Client(
      '18583978221-3926dnoc2anb3u939go00gk14brdmpsd.apps.googleusercontent.com',
    );
    const ticket = await client.verifyIdToken({
      idToken: body.idToken,
      audience:
        '18583978221-3926dnoc2anb3u939go00gk14brdmpsd.apps.googleusercontent.com',
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
