import { IsString } from 'class-validator';

export class TestDto {
  @IsString()
  a: string;

  @IsString()
  b: string;
}
