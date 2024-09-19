import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login() {
    return this.authService.login();
  }

  @Post('register')
  async register(@Body() user: User) {
    try {
      const users = await this.userService.findAll();

      if (users.some((u) => u.email === user.email)) {
        return {
          message: 'Email already exists',
          statusCode: 409,
        };
      }
    } catch (error: unknown) {
      console.error(error);
    }

    const registeredUser = await this.authService.register(user);

    return {
      message: 'User registration successful',
      statusCode: 201,
      data: registeredUser,
    };
  }
}
