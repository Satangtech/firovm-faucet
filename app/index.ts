import express, { Express, Request, Response } from "express";
import { fromHexAddress, getNetwork } from "./utils";
import { Context, PrivkeyAccount, Client } from "firovm-sdk";
import "dotenv/config";

const app: Express = express();
const port = Number(process.env.PORT) || 8123;
const bind = process.env.BIND || "0.0.0.0";
const network = process.env.NETWORK || "Regtest"; // ["Mainnet", "Testnet", "Regtest"]
const RPCURL = process.env.RPCURL || "http://guest:guest@127.0.0.1:8545";
const PRIVKEY = process.env.PRIVKEY || "";

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

    const account = new PrivkeyAccount(
      new Context().withNetwork(getNetwork(network.toLowerCase())),
      PRIVKEY
    );
    const client = new Client(RPCURL);

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

app.listen(port, bind, async () => {
  console.log(`[server]: Server is running at ${bind}:${port}`);
});
