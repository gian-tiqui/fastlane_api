import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './entity/login.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const users = await this.userService.findAll();

      const user = users.find((u) => u.email === loginDto.email);
      if (!user) {
        return { message: 'User not found', statusCode: 404 };
      }

      const passwordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (passwordMatch) {
        return this.authService.login(user.id, user.email, [user.role]);
      } else {
        return { message: 'Invalid password', statusCode: 401 };
      }
    } catch (error) {
      console.error(error);
      return { message: 'User not found', statusCode: 404 };
    }
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
