import { IsDate, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(7, 20)
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 100)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  middlename: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  lastname: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 20)
  role: string;

  @IsDate()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  sex: string;
}
