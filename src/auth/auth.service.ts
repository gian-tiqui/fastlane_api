import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RefreshToken } from './entity/refresh_token.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    private readonly configService: ConfigService,
  ) {}

  /*
   * @TODO: Login should return the existing refresh token when the user id is found in the database.
   */

  async login(_userId: number, userEmail: string, userRoles: string[]) {
    const payload = {
      id: _userId,
      email: userEmail,
      roles: userRoles,
    };

    const atSecret = this.configService.get<string>('AT_SECRET');
    const rtSecret = this.configService.get<string>('RT_SECRET');
    const atExp = this.configService.get<string>('AT_EXP');
    const rtExp = this.configService.get<string>('RT_EXP');

    try {
      const accessToken = jwt.sign(payload, atSecret, {
        expiresIn: atExp,
      });
      const refreshToken = jwt.sign(payload, rtSecret, {
        expiresIn: rtExp,
      });

      const existingToken = await this.refreshTokenRepo.findBy({
        userId: _userId,
      });

      if (existingToken) {
        return {
          accessToken,
          refreshToken: '',
        };
      } else {
        await this.refreshTokenRepo.save({
          token: refreshToken,
          userId: _userId,
          expiresAt: '2001-3-5',
        });
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register(user: User): Promise<User> {
    const salt = Number(this.configService.get<number>('SALT'));
    const hashedPassword = await bcrypt.hash(user.password, salt);

    return this.userRepo.save({
      ...user,
      password: hashedPassword,
    });
  }

  async logout(refreshToken: string) {
    const existingToken = await this.refreshTokenRepo.findOne({
      where: { token: refreshToken },
    });

    if (!existingToken) {
      return {
        message: 'Token not found',
        statusCode: 404,
      };
    }

    await this.refreshTokenRepo.delete(existingToken.id);

    return 'logged out successful';
  }

  async refresh() {
    return { accessToken: 'meow' };
  }
}
