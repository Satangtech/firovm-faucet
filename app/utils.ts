Object.defineProperty(global, "_bitcore", {
  get() {
    return undefined;
  },
  set() {},
});
const { Networks, Address } = require("fvmcore-lib");

export const fromHexAddress = (hash: string, network: string) => {
  const address = Address.fromPublicKeyHash(
    Buffer.from(hash.replace("0x", ""), "hex"),
    Networks.get(network)
  );
  return address.toString();
};
