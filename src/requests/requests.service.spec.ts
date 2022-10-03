import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FiroRpcModule } from '../firo-rpc/firo-rpc.module';
import { RequestsService } from './requests.service';

const mockAsset = {
  name: 'asset1',
  balance: 100,
  address: 'address1',
  symbol: 'symbol1',
  logo: 'logo1',
  decimal: 1e18,
};

describe('RequestsService', () => {
  let service: RequestsService;

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
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
