import { ConfigService } from '@nestjs/config';
import { User } from 'src/user/entity/user.entity';

let configModule: ConfigService;

const database = {
  type: 'mysql',
  host: configModule.get<string>('DB_HOST') || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'fastlane',
  entities: [User],
  synchronize: true, // change to true if needed
};

export default database;
