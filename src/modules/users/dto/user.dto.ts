import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UserDto {
  @Expose()
  @IsEmail()
  @IsString()
  @IsOptional()
  name: string;

  @Expose()
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;
}
