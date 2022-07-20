import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGO_URL || "mongodb://mongo:27017/";
const dbName = process.env.MONGO_DBNAME || "faucet";
const client = new MongoClient(uri);
export const database = client.db(dbName);
