import { Test, TestingModule } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';

describe('AssetsController', () => {
  let controller: AssetsController;
  let service: AssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [
        {
          provide: AssetsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                name: 'asset1',
                balance: 100,
                address: 'address1',
                symbol: 'symbol1',
                logo: 'logo1',
                decimal: 1e18,
              },
            ]),
            create: jest
              .fn()
              .mockImplementation((createAssetDto: CreateAssetDto) =>
                Promise.resolve({ _id: '1', ...createAssetDto }),
              ),
          },
        },
      ],
    }).compile();

    controller = module.get(AssetsController);
    service = module.get(AssetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new asset', async () => {
      const createAssetDto: CreateAssetDto = {
        name: 'name1',
        balance: 100,
        address: 'address1',
        symbol: 'symbol1',
        logo: 'logo1',
        decimal: 1e18,
      };

      expect(controller.create(createAssetDto)).resolves.toEqual({
        _id: '1',
        ...createAssetDto,
      });
    });
  });

  describe('findAll()', () => {
    it('should get an array of assets', () => {
      expect(controller.findAll()).resolves.toEqual([
        {
          name: 'asset1',
          balance: 100,
          address: 'address1',
          symbol: 'symbol1',
          logo: 'logo1',
          decimal: 1e18,
        },
      ]);
    });
  });
});
