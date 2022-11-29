import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FiroRpcService } from './firo-rpc.service';

describe('FiroRpcService', () => {
  let service: FiroRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [FiroRpcService],
    }).compile();

    service = module.get<FiroRpcService>(FiroRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get native balance', async () => {
    const balance = 999990396845520;
    jest
      .spyOn(service, 'getNativeBalance')
      .mockReturnValue(Promise.resolve(balance));
    expect(await service.getNativeBalance()).toEqual(balance);
  });

  it('should get asset balance', async () => {
    const contractAddress = '72883952c2efc7ce8d8b992dfea575719b750dc6';
    const balance = 123.123;
    jest
      .spyOn(service, 'getAssetBalance')
      .mockReturnValue(Promise.resolve(balance));
    expect(await service.getAssetBalance(contractAddress)).toEqual(balance);
  });

  it('should get txid from token transfer', async () => {
    const tokenAddress = '72883952c2efc7ce8d8b992dfea575719b750dc6';
    const nativeAddress = 'TKijwvuy2shFcKtdTsjvXjCB9fqrbJqdFK';
    const tokenDecimal = 1e18;
    jest
      .spyOn(service, 'tokenTransfer')
      .mockReturnValue(Promise.resolve('txid'));
    expect(
      await service.tokenTransfer(tokenAddress, nativeAddress, tokenDecimal),
    ).toEqual('txid');
  });

  it('should get txid from native transfer', async () => {
    const nativeAddress = 'TKijwvuy2shFcKtdTsjvXjCB9fqrbJqdFK';
    const tokenDecimal = 1e8;
    jest
      .spyOn(service, 'nativeTransfer')
      .mockReturnValue(Promise.resolve('txid'));
    expect(await service.nativeTransfer(nativeAddress, tokenDecimal)).toEqual(
      'txid',
    );
  });

  it('should get native address from check hex address', async () => {
    const nativeAddress = 'TBdTs1DEqhbGbTdoAmrpNtjzBm1FT7wnBs';
    expect(
      await service.checkHexAddress(
        '0x1234567890123456789012345678901234567890',
      ),
    ).toEqual(nativeAddress);
  });
});
