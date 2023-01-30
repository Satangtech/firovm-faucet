import axios from 'axios';
import {
  Client,
  Context,
  Network,
  PrivkeyAccount,
  RPCClient,
} from 'firovm-sdk';
import {
  abiERC20,
  byteCodeContractERC20,
  testAddresses,
  testPrivkeys,
} from '../data';

describe('Assets', () => {
  const url = 'http://faucet:3000/assets';
  const auth = {
    username: 'admin',
    password: 'admin',
  };
  const nativeAsset = {
    name: 'Native',
    address: '',
    symbol: 'FVM',
    logo: 'https://fvm.org/logo.png',
    decimal: 1e8,
  };
  const asset = {
    name: 'GOLD',
    address: '',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 1e18,
  };
  const urlFirovm = new URL('http://test:test@firovm:1234');
  const rpcClient = new RPCClient(urlFirovm.href);
  const client = new Client(urlFirovm.href);
  const address = testAddresses;
  const privkey = testPrivkeys;
  const context = new Context().withNetwork(Network.Testnet);
  const account = {
    acc1: new PrivkeyAccount(context, privkey.testPrivkey1),
    acc2: new PrivkeyAccount(context, privkey.testPrivkey2),
    acc3: new PrivkeyAccount(context, privkey.testPrivkey3),
    acc4: new PrivkeyAccount(context, privkey.testPrivkey4),
    acc5: new PrivkeyAccount(context, privkey.testPrivkey5),
  };
  let txid = '';

  const loadWallet = async () => {
    const res = await rpcClient.rpc('loadwallet', ['testwallet']);
  };

  const getNewAddress = async (): Promise<string> => {
    const res = await rpcClient.rpc('getnewaddress');
    const address = res.result;
    expect(typeof address).toBe('string');
    return address;
  };

  const generateToAddress = async () => {
    const res = await rpcClient.rpc('generatetoaddress', [
      1,
      address.testAddress1,
    ]);
    expect(res.result.length).toBeGreaterThan(0);
  };

  const deployContractERC20 = async () => {
    const contract = new client.Contract(abiERC20);
    const contractDeploy = contract.deploy(byteCodeContractERC20);
    txid = await contractDeploy.send({ from: account.acc1 });
    expect(typeof txid).toBe('string');
    await generateToAddress();

    const { result, error } = await rpcClient.getTransactionReceipt(txid);
    expect(error).toBeNull();
    expect(result.length).toBeGreaterThan(0);
    expect(typeof result[0].contractAddress).toBe('string');
    asset.address = result[0].contractAddress;
  };

  beforeAll(async () => {
    await loadWallet();
    await deployContractERC20();
  });

  it(`/POST native assets`, async () => {
    const { status, data } = await axios.post(url, nativeAsset, {
      auth,
    });
    // expect(status).toEqual(201);
    // expect(data.name).toEqual(nativeAsset.name);
    // expect(data.address).toEqual(nativeAsset.address);
    // expect(data.symbol).toEqual(nativeAsset.symbol);
    // expect(data.balance).toBeGreaterThan(0);
    console.log(data);
  });

  // it(`/POST Duplicate key`, async () => {
  //   await axios
  //     .post(url, nativeAsset, {
  //       auth,
  //     })
  //     .catch((err) => {
  //       expect(err.response.status).toEqual(400);
  //       expect(err.response.data.msg).toEqual('Duplicate key');
  //     });
  // });

  // it(`/POST assets`, async () => {
  //   const { status, data } = await axios.post(url, asset, {
  //     auth,
  //   });
  //   expect(status).toEqual(201);
  //   console.log(data);
  // });

  // it(`/GET assets`, async () => {
  //   const { status, data } = await axios.get(url);
  //   expect(status).toEqual(200);
  //   console.log(data);
  // });

  // it(`/GET assets/:id`, async () => {});

  // it(`Patch assets/:id`, async () => {});

  // it(`Delete assets/:id`, async () => {});

  // afterAll(async () => {});
});
