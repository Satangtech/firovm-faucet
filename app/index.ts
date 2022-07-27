import express, { Express, Request, Response } from "express";
import { fromHexAddress, getNetwork } from "./utils";
import { Context, PrivkeyAccount, Client, RPCClient } from "firovm-sdk";
import tokens from "./tokens.json";
import "dotenv/config";
import { CacheTimes, isReachLimit, setReachLimit } from "./models/reachLimit";
import { isExpire, setCache } from "./models/cache";
import cors from "cors";

const PORT = Number(process.env.PORT) || 8123;
const BIND = process.env.BIND || "0.0.0.0";
const NETWORK = process.env.NETWORK || "regtest"; // ["mainnet", "testnet", "regtest"]
const RPCURL = process.env.RPCURL || "http://guest:guest@127.0.0.1:8545";
const PRIVKEY = process.env.PRIVKEY;
const FAUCET_AMOUNT = Number(process.env.FAUCET_AMOUNT) || 100;
const NATIVE_TOKEN_NAME = process.env.NATIVE_TOKEN_NAME || "FVM";
const CACHE_TIMES_MINUTE = Number(process.env.CACHE_TIMES_MINUTE) || 15;

if (PRIVKEY === "") {
  throw Error("Private key is not provided!");
}

const app: Express = express();
const account = new PrivkeyAccount(
  new Context().withNetwork(getNetwork(NETWORK)),
  PRIVKEY
);
const rpc = new RPCClient(RPCURL);
const client = new Client(RPCURL);
type TypeTokens = keyof typeof tokens;

app.use(cors());
app.use(express.json());

app.post("/request", async (req: Request, res: Response) => {
  let { asset, address } = req.body;
  try {
    let nativeAddress = address;
    address = (<string>address).replace("0x", "");
    if (address.length === 40) {
      nativeAddress = fromHexAddress(address, NETWORK);
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const { limit, fields } = await isReachLimit(<string>ip, nativeAddress);
    if (limit === "address") {
      return res.status(400).send({
        id: "REACH_LIMIT_ADDRESS",
        reason: "the address reach limit",
        fields,
      });
    }
    if (limit === "ip") {
      return res.status(400).send({
        id: "REACH_LIMIT_IP",
        reason: "the IP reach limit",
        fields,
      });
    }

    const token = tokens[asset as TypeTokens];
    if (token && token.address !== "") {
      const txId = await client.tokenTransfer(
        account,
        token.address,
        nativeAddress,
        BigInt(FAUCET_AMOUNT * token.decimal)
      );
      await setReachLimit(<string>ip, nativeAddress);
      return res.status(201).send({ tx: txId });
    } else {
      const txId = await client.sendFrom(
        account,
        [
          {
            to: nativeAddress as string,
            value: FAUCET_AMOUNT * 1e8,
          },
        ],
        { feePerKb: 1000 }
      );
      await setReachLimit(<string>ip, nativeAddress);
      return res.status(201).send({ tx: txId });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: (<any>err).message });
  }
});

app.get("/assets", async (req: Request, res: Response) => {
  try {
    const cacheKey = "/assets";
    const { expire, cache } = await isExpire(cacheKey);
    if (!expire && cache) {
      return res.send(cache.value);
    }

    const address = account.address().toString();
    const { result } = await rpc.getAddressBalance(address);
    const assets: any = [
      {
        name: NATIVE_TOKEN_NAME,
        balance: result.balance / 1e8,
        address,
      },
    ];

    for (let tokenName in tokens) {
      const token = tokens[tokenName as TypeTokens];
      const tokenAddress = token.address.replace("0x", "");
      const { result, error } = await rpc.getTokenBalance(
        tokenAddress,
        address
      );
      if (error) {
        assets.push({
          name: tokenName,
          error,
        });
      } else {
        assets.push({
          name: tokenName,
          balance: result,
          address,
          symbol: token.symbol,
          logo: token.logo,
        });
      }
    }

    await setCache(cacheKey, assets, CACHE_TIMES_MINUTE * CacheTimes.Minute);
    res.send(assets);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: (<any>err).message });
  }
});

app.listen(PORT, BIND, async () => {
  console.log(`[server]: Server is running at ${BIND}:${PORT}`);
});
