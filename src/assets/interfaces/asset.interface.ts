import { Document } from 'mongoose';

export interface Asset extends Document {
  readonly name: string;
  readonly balance: number;
  readonly address: string;
  readonly symbol: string;
  readonly logo: string;
  readonly decimal: number;
}
