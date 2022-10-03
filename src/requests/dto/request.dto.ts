import { IsString } from 'class-validator';

export class RequestDto {
  @IsString()
  readonly asset: string;

  @IsString()
  readonly address: string;
}
