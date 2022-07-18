import express, { Express, Request, Response } from "express";
import { fromHexAddress } from "./utils";
import { RPCClient } from "firovm-sdk";
import "dotenv/config";

const app: Express = express();
const port = Number(process.env.PORT) || 8123;
const bind = process.env.BIND || "0.0.0.0";
const network = process.env.NETWORK || "regtest";
const RPCURL = process.env.RPCURL || "http://guest:guest@127.0.0.1:8545";

app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  let { address = "", amount = 0 } = req.query;
  try {
    if (address === "") {
      return res.send({
        message: "Invalid Input! Ex: /?address=abc&amount=123",
        address,
        amount,
      });
    }
    let nativeAddress = address;

    // check hex address
    address = (<string>address).replace("0x", "");
    if (address.length === 40) {
      nativeAddress = fromHexAddress(address, network);
    }

    const firovm = new RPCClient(RPCURL);
    const result = await firovm.rpc("generatetoaddress", [
      1,
      nativeAddress,
      Number(amount),
    ]);
    return res.send(result);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: (<any>err).message });
  }
});

app.listen(port, bind, async () => {
  console.log(`[server]: Server is running at ${bind}:${port}`);
});
