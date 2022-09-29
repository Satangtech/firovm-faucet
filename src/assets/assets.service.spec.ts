import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
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
    name: 'asset1',
    balance: 100,
    address: 'address1',
    symbol: 'symbol1',
    logo: 'logo1',
    decimal: 1e18,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetsService,
        {
          provide: 'ASSET_MODEL',
          useValue: {
            new: jest.fn().mockResolvedValue(mockAsset),
            constructor: jest.fn().mockResolvedValue(mockAsset),
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
