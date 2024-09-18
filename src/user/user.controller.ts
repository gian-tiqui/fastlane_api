import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const data = await this.userService.findAll();

    const responseBody = {
      message: `ok`,
      statusCode: 200,
      data,
    };

    return responseBody;
  }

  @Get(`:id`)
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.userService.findOne(Number(id));

      if (!user) {
        return {
          message: 'User not found',
          statusCode: 404,
        };
      }

      return user;
    } catch (error: unknown) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error occured while fetching the user',
      );
    }
  }

  @Post()
  async create(@Body() user: User) {
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
    return await this.userService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: User) {
    return this.userService.update(Number(id), user);
  }

  @Delete(`:id`)
  delete(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }
}
