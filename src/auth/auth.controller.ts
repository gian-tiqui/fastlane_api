import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
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
      // Fetch all users that will be needed for finding.
      const users = await this.userService.findAll();

      const user = users.find((u) => u.email === loginDto.email);

      // If user does not exist, return a 404 message
      if (!user) {
        return { message: 'User not found', statusCode: 404 };
      }

      // Compare passwords through their hashes.
      const passwordMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      // If password matches, authentication will proceed.
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

      // Check if email already exists. If it does, return a 409 message.  If it doesn't, proceed with registration.
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

  @Post('logout')
  async logout(@Body() body: { refreshToken: string }) {
    this.authService.logout(body.refreshToken);
  }
}
