import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Context,
  Network,
  PrivkeyAccount,
  RPCClient,
  Client,
} from 'firovm-sdk';

@Injectable()
export class FiroRpcService {
  private account: PrivkeyAccount;
  private rpc: RPCClient;
  private client: Client;
  private address: string;
  private rpcUrl: string;

  constructor(private configService: ConfigService) {
    this.rpcUrl = this.configService.get<string>('RPC_URL');
    this.account = new PrivkeyAccount(
      new Context().withNetwork(this.getNetWork()),
      this.configService.get<string>('PRIVKEY'),
    );
    this.rpc = new RPCClient(this.rpcUrl);
    this.client = new Client(this.rpcUrl);
    this.address = this.account.address().toString();
  }

  getNetWork() {
    const network = this.configService.get<string>('NETWORK');
    switch (network) {
      case 'mainnet':
        return Network.Mainnet;
      case 'testnet':
        return Network.Testnet;
      case 'regtest':
        return Network.Regtest;
      default:
        return Network.Regtest;
    }
  }

  async getNativeBalance(): Promise<number> {
    const { result, error } = await this.rpc.getAddressBalance(
      this.account.address().toString(),
    );
    if (error) {
      throw new HttpException(error.message, 500);
    }
    return result.balance;
  }

  async getAssetBalance(assetAddress: string): Promise<number> {
    const { result, error } = await this.rpc.getTokenBalance(
      assetAddress,
      this.address,
    );
    if (error) {
      throw new HttpException(error.message, 500);
    }
    return result;
  }
}