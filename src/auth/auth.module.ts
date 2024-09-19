import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entity/auth.entity';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  exports: [AuthService],
})
export class AuthModule {}
