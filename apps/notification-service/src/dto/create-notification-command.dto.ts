import { IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNotificationCommandDto {
  @IsUUID()
  userId!: string;

  @IsString()
  type!: string;

  @IsString()
  title!: string;

  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  channel = 'in_app';

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
