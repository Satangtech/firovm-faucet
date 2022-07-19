import { Network } from "firovm-sdk";
const { Networks, Address } = require("fvmcore-lib");

export const fromHexAddress = (hash: string, network: string) => {
  const address = Address.fromPublicKeyHash(
    Buffer.from(hash.replace("0x", ""), "hex"),
    Networks.get(network)
  );
  return address.toString();
};

export const getNetwork = (network: string) => {
  if (network === "Testnet") return Network.Testnet;
  if (network === "Mainnet") return Network.Mainnet;
  return Network.Regtest;
};
