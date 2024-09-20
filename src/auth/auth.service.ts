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

  async login(_userId: number, userEmail: string, userRoles: string[]) {
    // Payload that will be sent to the shets
    const payload = {
      id: _userId,
      email: userEmail,
      roles: userRoles,
    };

    // Get secrets and expirations from the ENV variables.
    const atSecret = this.configService.get<string>('AT_SECRET');
    const rtSecret = this.configService.get<string>('RT_SECRET');
    const atExp = this.configService.get<string>('AT_EXP');
    const rtExp = this.configService.get<string>('RT_EXP');

    try {
      // Generate Access Token and Refresh Token
      const accessToken = jwt.sign(payload, atSecret, {
        expiresIn: atExp,
      });
      const refreshToken = jwt.sign(payload, rtSecret, {
        expiresIn: rtExp,
      });

      // Check if refresh token exists in the database, if not, create a new one.
      const existingToken = await this.refreshTokenRepo.find({
        where: { userId: _userId },
      });

      // If token exists in the database, return the same token unless its expired.
      if (existingToken.length > 0) {
        return {
          message: 'Access Token generated',
          tokens: { accessToken, refreshToken: existingToken[0].token },
        };
      } else {
        await this.refreshTokenRepo.save({
          token: refreshToken,
          userId: _userId,
          expiresAt: '2001-3-5',
        });
      }

      return {
        message: 'Tokens generated',
        statusCode: '200',
        tokens: { accessToken, refreshToken },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async register(user: User): Promise<User> {
    // Get the salt from the ENV variables
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

    return {
      message: 'User logged out successfully',
      statusCode: 200,
    };
  }

  async refresh() {
    return { accessToken: 'meow' };
  }
}
