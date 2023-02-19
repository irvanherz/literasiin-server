import { InjectQueue } from '@nestjs/bull';
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Queue } from 'bull';
import { MailsService } from 'src/notifications/mails.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignOutDto } from './dto/signout.dto';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { GoogleAuthGuard } from './google-auth.guard';
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
  ) {}

  @Post('/signup')
  async signupWithEmail(@Body() signupWithEmailDto: SignupWithEmailDto) {
    const user = await this.authService.signupWithEmail(signupWithEmailDto);
    const auth = await this.authService.signin({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
    return {
      data: user,
      meta: auth,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(@User() user, @Body() body) {
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
    const ok = await this.authService.signout(body);
    // if (!ok) throw new NotFoundException();
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google')
  continueWithGoogle(@Request() req) {
    console.log('login', req.user);
    return this.authService.signin({ id: 1, name: 'Kucing' });
  }

  @UseGuards(GoogleAuthGuard)
  @Get('/google/redirect')
  async continueWithGoogleRedirect() {
    const data = await this.authService.signin({ id: 1, name: 'Kucing' });
    const jsonData = JSON.stringify(data);

    return `
      <!DOCTYPE html>
      <html>
      <script>
        const data = ${jsonData};
        window.opener.postMessage({ type: 'google-auth-completed', data: data }, '*');
        window.close();
      </script>
      </body>

      </html>
    `;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Request() req) {
    console.log('A', req.user);

    return req.user;
  }
}
