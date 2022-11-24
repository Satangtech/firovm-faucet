import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { Asset } from '../assets/interfaces/asset.interface';
import { FiroRpcModule } from '../firo-rpc/firo-rpc.module';
import { FiroRpcService } from '../firo-rpc/firo-rpc.service';
import { RequestsService } from './requests.service';

const mockAsset = [
  {
    name: 'asset1',
    balance: 100,
    address: '',
    symbol: 'symbol1',
    logo: 'logo1',
    decimal: 1e18,
  },
  {
    name: 'asset2',
    balance: 100,
    address: 'address2',
    symbol: 'symbol2',
    logo: 'logo2',
    decimal: 1e18,
  },
];

describe('RequestsService', () => {
  let service: RequestsService;
  let model: Model<Asset>;
  let firoRpcService: FiroRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule, CacheModule.register(), FiroRpcModule],
      providers: [
        RequestsService,
        {
          provide: 'ASSET_MODEL',
          useValue: {
            new: jest.fn().mockResolvedValue(mockAsset),
            constructor: jest.fn().mockResolvedValue(mockAsset),
            findOneAndUpdate: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    model = module.get<Model<Asset>>('ASSET_MODEL');
    firoRpcService = module.get<FiroRpcService>(FiroRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a txIdNative', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset[0]),
    } as any);

    jest
      .spyOn(firoRpcService, 'nativeTransfer')
      .mockReturnValue(Promise.resolve('txIdNative'));

    const tx = await service.requestAsset(
      { asset: 'asset1', address: 'addr1' },
      '127.0.0.1',
    );
    expect(tx).toEqual('txIdNative');
  });

  it('should return a txIdToken', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset[1]),
    } as any);

    jest
      .spyOn(firoRpcService, 'tokenTransfer')
      .mockReturnValue(Promise.resolve('txIdToken'));

    const tx = await service.requestAsset(
      { asset: 'asset2', address: 'addr1' },
      '127.0.0.1',
    );
    expect(tx).toEqual('txIdToken');
  });

  it('should return a txIdNative and txIdToken', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset[0]),
    } as any);

    jest
      .spyOn(firoRpcService, 'nativeTransfer')
      .mockReturnValue(Promise.resolve('txIdNative'));

    const tx1 = await service.requestAsset(
      { asset: 'asset1', address: 'addr1' },
      '127.0.0.1',
    );
    expect(tx1).toEqual('txIdNative');

    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset[1]),
    } as any);

    jest
      .spyOn(firoRpcService, 'tokenTransfer')
      .mockReturnValue(Promise.resolve('txIdToken'));

    const tx2 = await service.requestAsset(
      { asset: 'asset2', address: 'addr1' },
      '127.0.0.1',
    );
    expect(tx2).toEqual('txIdToken');
  });

  it('should return a error REACH_LIMIT_IP', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset[1]),
    } as any);

    jest
      .spyOn(firoRpcService, 'tokenTransfer')
      .mockReturnValue(Promise.resolve('txIdToken1'));

    const tx1 = await service.requestAsset(
      { asset: 'asset1', address: 'addr1' },
      '127.0.0.1',
    );
    expect(tx1).toEqual('txIdToken1');

    try {
      await service.requestAsset(
        { asset: 'asset1', address: 'addr1' },
        '127.0.0.1',
      );
    } catch (error) {
      expect(error.response.id).toEqual('REACH_LIMIT_IP');
    }
  });

  it('should return a error REACH_LIMIT_ADDRESS', async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset[1]),
    } as any);

    jest
      .spyOn(firoRpcService, 'tokenTransfer')
      .mockReturnValue(Promise.resolve('txIdToken1'));

    const tx1 = await service.requestAsset(
      { asset: 'asset1', address: 'addr1' },
      '127.0.0.1',
    );
    expect(tx1).toEqual('txIdToken1');

    try {
      await service.requestAsset(
        { asset: 'asset1', address: 'addr1' },
        '127.0.0.2',
      );
    } catch (error) {
      expect(error.response.id).toEqual('REACH_LIMIT_ADDRESS');
    }
  });
});
