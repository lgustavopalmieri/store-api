import {
  MaxLength,
  IsString,
  IsNotEmpty,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class CreateUserDto {
  @MaxLength(100)
  @IsString()
  // @Transform()
  @IsNotEmpty()
  name: string;

  @MaxLength(11)
  @IsString()
  // @Transform()
  @IsNotEmpty()
  cpf: string;

  @IsEmail()
  @IsString()
  // @Transform()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  admin: boolean;
}
