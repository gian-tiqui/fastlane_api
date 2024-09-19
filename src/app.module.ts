import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RefreshToken } from './auth/entity/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'fastlane',
      entities: [User],
      synchronize: true, // change to true if needed
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([RefreshToken]),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
