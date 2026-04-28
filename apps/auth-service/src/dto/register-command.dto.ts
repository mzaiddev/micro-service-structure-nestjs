import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterCommandDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
