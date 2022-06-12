import { MaxLength, IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
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

  admin: boolean;
}
