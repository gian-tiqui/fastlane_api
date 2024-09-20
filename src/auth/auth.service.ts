import { Injectable } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async login(userId: number, userEmail: string, userRoles: string[]) {
    const payload = {
      id: userId,
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
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error generating JWT:', error);
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

    return null;
  }
}
