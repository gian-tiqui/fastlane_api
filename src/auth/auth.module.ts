import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/refresh_token.entity';
import { UserService } from 'src/user/user.service';
import { UserController } from 'src/user/user.controller';
import { User } from 'src/user/entity/user.entity';

@Module({
  providers: [AuthService, UserService],
  controllers: [AuthController, UserController],
  imports: [TypeOrmModule.forFeature([RefreshToken, User])],
  exports: [AuthService],
})
export class AuthModule {}
