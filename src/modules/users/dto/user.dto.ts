import { Expose, Exclude } from 'class-transformer';
import { IsEmail, IsString, IsOptional, IsNumber } from 'class-validator';

export class UserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsEmail()
  @IsString()
  name: string;

  @Expose()
  @IsEmail()
  @IsString()
  email: string;
}
