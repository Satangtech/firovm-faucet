import * as mongoose from 'mongoose';

export const AssetSchema = new mongoose.Schema({
  name: String,
  balance: { type: Number, default: 0 },
  address: { type: String, unique: true },
  symbol: String,
  logo: String,
  decimal: Number,
});
