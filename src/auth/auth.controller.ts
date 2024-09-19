import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshToken } from './entity/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login() {
    return this.authService.login();
  }

  @Post('register')
  async register(@Body() body: RefreshToken) {
    return body;
  }
}
