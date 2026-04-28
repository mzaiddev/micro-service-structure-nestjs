import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpsertProfileCommandDto {
  @IsUUID()
  authUserId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsString()
  phone?: string;
}
