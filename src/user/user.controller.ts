import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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
    return this.userService.findOne(Number(id));
  }

  @Post()
  async create(@Body() user: User) {
    return await this.userService.create(user);
  }

  @Delete(`:id`)
  delete(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }
}
