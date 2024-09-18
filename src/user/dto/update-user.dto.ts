import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateUser {
  @IsString()
  @IsNotEmpty()
  @Length(4, 20)
  username: string;

  @IsString()
  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 50)
  role: string;
}
