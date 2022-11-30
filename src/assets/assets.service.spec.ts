import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';

import { FiroRpcModule } from '../firo-rpc/firo-rpc.module';
import { FiroRpcService } from '../firo-rpc/firo-rpc.service';
import { AssetsService } from './assets.service';
import { Asset } from './interfaces/asset.interface';

const mockAsset = {
  name: 'asset1',
  balance: 100,
  address: 'address1',
  symbol: 'symbol1',
  logo: 'logo1',
  decimal: 1e18,
};

const assetsArray = [
  {
    name: 'asset native',
    balance: 100,
    address: '',
    symbol: 'symbol1',
    logo: 'logo1',
    decimal: 1e8,
  },
  {
    name: 'asset2',
    balance: 100,
    address: 'address1',
    symbol: 'symbol1',
    logo: 'logo1',
    decimal: 1e18,
  },
];

describe('AssetService', () => {
  let service: AssetsService;
  let model: Model<Asset>;
  let firoRpcService: FiroRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
        }),
        CacheModule.register(),
        FiroRpcModule,
      ],
      providers: [
        AssetsService,
        {
          provide: 'ASSET_MODEL',
          useValue: {
            new: jest.fn().mockResolvedValue(mockAsset),
            constructor: jest.fn().mockResolvedValue(mockAsset),
            findOneAndUpdate: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(AssetsService);
    model = module.get<Model<Asset>>('ASSET_MODEL');
    firoRpcService = module.get<FiroRpcService>(FiroRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all assets', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(assetsArray),
    } as any);

    jest
      .spyOn(model, 'findOneAndUpdate')
      .mockResolvedValueOnce(assetsArray[0] as any)
      .mockResolvedValueOnce(assetsArray[1] as any);

    jest
      .spyOn(firoRpcService, 'getNativeBalance')
      .mockReturnValue(Promise.resolve(100));

    jest
      .spyOn(firoRpcService, 'getAssetBalance')
      .mockReturnValue(Promise.resolve(100));

    const assets = await service.findAll();
    expect(assets).toEqual(assetsArray);
  });
});
