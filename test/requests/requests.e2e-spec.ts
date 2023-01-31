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

describe('Requests', () => {
  jest.setTimeout(60 * 1000);
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
  const goldAsset = {
    name: 'GOLD',
    address: '',
    symbol: 'GLD',
    logo: 'https://gold.org/logo.png',
    decimal: 1e18,
  };
  let txid = '';

  const url = 'http://faucet:3000/requests';
  const urlAssets = 'http://faucet:3000/assets';
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
    goldAsset.address = result[0].contractAddress;
  };

  const createAssets = async () => {
    await axios
      .post(urlAssets, nativeAsset, {
        auth,
      })
      .catch((err) => {
        // pass
      });
    await axios
      .post(urlAssets, goldAsset, {
        auth,
      })
      .catch((err) => {
        // pass
      });
  };

  beforeAll(async () => {
    await loadWallet();
    await deployContractERC20();
    await createAssets();
  });

  beforeEach(async () => {
    await generateToAddress();
  });

  it(`/POST requestAsset Native`, async () => {
    const { status, data } = await axios.post(url, {
      address: address.testAddress2,
      asset: nativeAsset.symbol,
    });
    expect(status).toEqual(200);
    expect(typeof data.tx).toBe('string');
  });

  it(`/POST requestAsset Token`, async () => {
    const { status, data } = await axios.post(url, {
      address: address.testAddress2,
      asset: goldAsset.symbol,
    });
    expect(status).toEqual(200);
    expect(typeof data.tx).toBe('string');
  });

  // it(`/POST requestAsset Native Fail`, async () => {
  //   await axios
  //     .post(url, {
  //       address: address.testAddress2,
  //       asset: nativeAsset.symbol,
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // });

  afterAll(async () => {
    const { status, data } = await axios.get(urlAssets);
    expect(status).toEqual(200);
    if (data.length > 0) {
      for (const asset of data) {
        const { status } = await axios.delete(`${urlAssets}/${asset._id}`, {
          auth,
        });
        expect(status).toEqual(204);
      }
    }
  });
});
