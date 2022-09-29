import { IsNumber, IsString } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly balance: number;

  @IsString()
  readonly address: string;

  @IsString()
  readonly symbol: string;

  @IsString()
  readonly logo: string;

  @IsNumber()
  readonly decimal: number;
}
