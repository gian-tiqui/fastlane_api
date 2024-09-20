import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entity/user.entity';

let configService: ConfigService;

const database = {
  type: 'mysql',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASS'),
  database: configService.get<string>('DB_NAME'),
  entities: [User],
  synchronize: configService.get<string>('NODE_ENV') == 'development', // change to true if needed
};

export default database;
