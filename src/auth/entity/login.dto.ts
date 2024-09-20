import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password: string;
}
