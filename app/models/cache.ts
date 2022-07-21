import { ObjectId } from "mongodb";
import { database } from "./db";
import { CacheTimes } from "./reachLimit";

interface Cache {
  _id: ObjectId;
  key: string;
  value: any;
  expireTime: number;
}

export const cacheCollection = database.collection<Cache>("cache");

export const setCache = async (
  key: string,
  value: any,
  time: CacheTimes = 10 * CacheTimes.Minute
) => {
  await cacheCollection.updateOne(
    { key },
    { $set: { value, expireTime: Date.now() + time } },
    { upsert: true }
  );
};

export const isExpire = async (key: string) => {
  const cache = await cacheCollection.findOne({ key });
  return { expire: cache && cache.expireTime < Date.now(), cache };
};
