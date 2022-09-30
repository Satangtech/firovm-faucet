import { IsNumber, IsString } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly address: string; // Blank for native token

  @IsString()
  readonly symbol: string;

  @IsString()
  readonly logo: string;

  @IsNumber()
  readonly decimal: number;
}
