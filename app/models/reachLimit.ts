import { ObjectId } from "mongodb";
import { database } from "./db";

export enum CacheTimes {
  None = 0,
  Second = 1000,
  Minute = 60 * 1000,
  Hour = CacheTimes.Minute * 60 * 1000,
  Day = CacheTimes.Hour * 24 * 1000,
  Month = CacheTimes.Day * 30 * 1000,
  Year = CacheTimes.Day * 365 * 1000,
}

interface ReachLimit {
  _id: ObjectId;
  ip: string;
  address: string;
  expireTime: number;
}

export const reachLimitCollection =
  database.collection<ReachLimit>("reachlimits");

export const setReachLimit = async (ip: string, address: string) => {
  await reachLimitCollection.updateOne(
    { ip, address },
    { $set: { expireTime: Date.now() + CacheTimes.Day } },
    { upsert: true }
  );
};

export const isReachLimit = async (ip: string, address: string) => {
  const limitByAddress = await reachLimitCollection.findOne({ address });
  if (limitByAddress && limitByAddress.expireTime > Date.now()) {
    return {
      limit: "address",
      fields: { address, until: limitByAddress.expireTime },
    };
  }

  const limitByIp = await reachLimitCollection.findOne({ ip });
  if (limitByIp && limitByIp.expireTime > Date.now()) {
    return {
      limit: "ip",
      fields: { ip, until: limitByIp.expireTime },
    };
  }
  return {
    limit: "",
    fields: {},
  };
};
