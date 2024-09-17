import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    const data = await this.userService.findAll();

    const responseBody = {
      message: `ok`,
      status: 200,
      data,
    };

    return responseBody;
  }

  @Get(`:id`)
  async findOne(@Param('id') id: number) {
    try {
      const user = await this.userService.findOne(Number(id));

      if (!user) throw new NotFoundException(`User with ${id} not found`);

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
        throw new InternalServerErrorException(
          'Email already exists in the system',
        );
      }
    } catch (error: unknown) {
      console.error(error);
    }
    return await this.userService.create(user);
  }

  @Delete(`:id`)
  delete(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }
}
