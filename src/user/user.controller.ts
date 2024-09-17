import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { UserService } from 'src/service/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(`:id`)
  findOne(@Param('id') id: number) {
    return this.userService.findOne(Number(id));
  }

  @Post()
  create(@Body() user: User) {
    this.userService.create(user);
  }

  @Delete(`:id`)
  delete(@Param('id') id: number) {
    return this.userService.delete(Number(id));
  }
}
