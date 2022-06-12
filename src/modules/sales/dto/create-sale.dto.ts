import { IsString, IsNotEmpty, IsDecimal } from 'class-validator';

export class CreateSaleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;
}
