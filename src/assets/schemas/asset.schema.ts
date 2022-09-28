import * as mongoose from 'mongoose';

export const AssetSchema = new mongoose.Schema({
  name: String,
  balance: Number,
  address: String,
  symbol: String,
  logo: String,
  decimal: Number,
});
