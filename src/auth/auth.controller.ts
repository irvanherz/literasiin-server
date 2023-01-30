import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupWithEmailDto } from './dto/signup-with-email.dto';
import { GoogleAuthGuard } from './google-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signupWithEmail(@Body() signupWithEmailDto: SignupWithEmailDto) {
    const user = await this.authService.signupWithEmail(signupWithEmailDto);
    const auth = this.authService.signin(user);
    return {
      data: user,
      meta: auth,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  async signIn(@Request() req) {
    const auth = await this.authService.signin(req.user);
    return {
      data: req.user,
      meta: auth,
    };
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
