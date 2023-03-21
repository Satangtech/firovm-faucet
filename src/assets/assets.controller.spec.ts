import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';

describe('AssetsController', () => {
  let controller: AssetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
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
                decimal: 18,
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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should create a new asset', async () => {
      const createAssetDto: CreateAssetDto = {
        name: 'name1',
        address: 'address1',
        symbol: 'symbol1',
        logo: 'logo1',
        decimal: 18,
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
          decimal: 18,
        },
      ]);
    });
  });
});
