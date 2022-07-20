import express, { Express, Request, Response } from "express";
import { fromHexAddress, getNetwork } from "./utils";
import { Context, PrivkeyAccount, Client, RPCClient } from "firovm-sdk";
import tokens from "./tokens.json";
import "dotenv/config";

const app: Express = express();
const port = Number(process.env.PORT) || 8123;
const bind = process.env.BIND || "0.0.0.0";
const network = process.env.NETWORK || "Regtest"; // ["Mainnet", "Testnet", "Regtest"]
const RPCURL = process.env.RPCURL || "http://guest:guest@127.0.0.1:8545";
const PRIVKEY = process.env.PRIVKEY || "";

const account = new PrivkeyAccount(
  new Context().withNetwork(getNetwork(network.toLowerCase())),
  PRIVKEY
);
const rpc = new RPCClient(RPCURL);
const client = new Client(RPCURL);
type TypeTokens = keyof typeof tokens;

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  let { address = "" } = req.query;
  try {
    if (address === "") {
      return res.send({
        message: "Invalid Input! Ex: /?address=abc",
        address,
      });
    }
    let nativeAddress = address;

    // check hex address
    address = (<string>address).replace("0x", "");
    if (address.length === 40) {
      nativeAddress = fromHexAddress(address, network.toLowerCase());
    }

    const txId = await client.sendFrom(
      account,
      [
        {
          to: nativeAddress as string,
          value: 100 * 1e8,
        },
      ],
      { feePerKb: 1000 }
    );
    return res.send({ txId });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: (<any>err).message });
  }
});

app.post("/request", async (req: Request, res: Response) => {
  let { asset, address } = req.body;
  try {
    let nativeAddress = address;

    // check hex address
    address = (<string>address).replace("0x", "");
    if (address.length === 40) {
      nativeAddress = fromHexAddress(address, network.toLowerCase());
    }

    const token = tokens[asset as TypeTokens];
    if (token && token.address === "") {
      const txId = await client.sendFrom(
        account,
        [
          {
            to: nativeAddress as string,
            value: 100 * 1e8,
          },
        ],
        { feePerKb: 1000 }
      );
      return res.status(201).send({ tx: txId });
    }

    if (token && token.address !== "") {
      const txId = await client.tokenTransfer(
        account,
        token.address,
        nativeAddress,
        BigInt(1e18)
      );
      return res.status(201).send({ tx: txId });
    }

    return res.status(404).send({ message: "Asset not found!" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: (<any>err).message });
  }
});

app.get("/assets", async (req: Request, res: Response) => {
  try {
    const address = account.address().toString();
    const assets = [];

    for (let tokenName in tokens) {
      const token = tokens[tokenName as TypeTokens];
      const tokenAddress = token.address.replace("0x", "");

      if (tokenAddress === "") {
        const { result } = await rpc.getAddressBalance(address);
        assets.push({
          name: tokenName,
          balance: result.balance / 1e8,
          address,
        });
      } else {
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
          });
        }
      }
    }

    res.send(assets);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: (<any>err).message });
  }
});

app.listen(port, bind, async () => {
  console.log(`[server]: Server is running at ${bind}:${port}`);
});
