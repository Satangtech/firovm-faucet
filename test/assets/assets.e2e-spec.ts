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
  let assetID = '';
  let nativeAssetID = '';
  let txid = '';

  const url = 'http://faucet:3000/assets';
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

  const loadWallet = async () => {
    await rpcClient.rpc('loadwallet', ['testwallet']);
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
    jest.setTimeout(180 * 1000);
    await loadWallet();
    await deployContractERC20();
  });

  it(`/POST native assets`, async () => {
    const { status, data } = await axios.post(url, nativeAsset, {
      auth,
    });
    expect(status).toEqual(201);
    expect(data.name).toEqual(nativeAsset.name);
    expect(data.address).toEqual(nativeAsset.address);
    expect(data.symbol).toEqual(nativeAsset.symbol);
    expect(data.balance).toBe(0);
    nativeAssetID = data._id;
  });

  it(`/POST Duplicate key`, async () => {
    await axios
      .post(url, nativeAsset, {
        auth,
      })
      .catch((err) => {
        expect(err.response.data.statusCode).toEqual(400);
        expect(err.response.data.message).toEqual('Duplicate key');
      });
  });

  it(`/POST assets`, async () => {
    const { status, data } = await axios.post(url, asset, {
      auth,
    });
    expect(status).toEqual(201);
    expect(data.name).toEqual(asset.name);
    expect(data.address).toEqual(asset.address);
    expect(data.symbol).toEqual(asset.symbol);
    expect(data.balance).toBe(0);
    assetID = data._id;
  });

  it(`/GET assets`, async () => {
    const { status, data } = await axios.get(url);
    expect(status).toEqual(200);
    expect(data.length).toBe(2);
  });

  it(`/GET assets/:id`, async () => {
    const { status, data } = await axios.get(`${url}/${assetID}`);
    expect(status).toEqual(200);
    expect(data.name).toEqual(asset.name);
    expect(data.address).toEqual(asset.address);
    expect(data.symbol).toEqual(asset.symbol);
    expect(data.balance).toBeGreaterThan(0);
  });

  it(`/GET native assets/:id`, async () => {
    const { status, data } = await axios.get(`${url}/${nativeAssetID}`);
    expect(status).toEqual(200);
    expect(data.name).toEqual(nativeAsset.name);
    expect(data.address).toEqual(nativeAsset.address);
    expect(data.symbol).toEqual(nativeAsset.symbol);
    expect(data.balance).toBeGreaterThan(0);
  });

  it(`/GET assets/:id invalid objectid`, async () => {
    await axios.get(`${url}/123`).catch((err) => {
      expect(err.response.data.statusCode).toEqual(400);
      expect(err.response.data.message).toEqual('Invalid ObjectId');
    });
  });

  it(`/GET assets/:id not found`, async () => {
    await axios.get(`${url}/5e6c3d3c3b3f8f1c1c6c3d3c`).catch((err) => {
      expect(err.response.data.statusCode).toEqual(404);
      expect(err.response.data.message).toEqual('Asset not found');
    });
  });

  it(`Patch assets/:id`, async () => {
    const { status, data } = await axios.patch(
      `${url}/${assetID}`,
      {
        name: 'Gold',
      },
      {
        auth,
      },
    );
    expect(status).toEqual(200);
    expect(data.name).toEqual('Gold');
    expect(data.address).toEqual(asset.address);
    expect(data.symbol).toEqual(asset.symbol);
    expect(data.balance).toBeGreaterThan(0);
  });

  it(`Delete assets/:id`, async () => {
    const { status: statusDel } = await axios.delete(`${url}/${assetID}`, {
      auth,
    });
    expect(statusDel).toEqual(204);

    const { status, data } = await axios.get(url);
    expect(status).toEqual(200);
    expect(data.length).toBe(1);
  });
});
