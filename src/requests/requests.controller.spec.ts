import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RequestDto } from './dto/request.dto';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

describe('RequestsController', () => {
  let controller: RequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [RequestsController],
      providers: [
        {
          provide: RequestsService,
          useValue: {
            requestAsset: jest.fn().mockResolvedValue('tx1'),
          },
        },
      ],
    }).compile();

    controller = module.get<RequestsController>(RequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should request assets', async () => {
    const requestDto: RequestDto = {
      address: 'address1',
      asset: 'asset1',
    };
    expect(controller.requestAsset(requestDto, '127.0.0.1')).resolves.toEqual({
      tx: 'tx1',
    });
  });
});
