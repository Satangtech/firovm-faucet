import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { FiroRpcService } from './firo-rpc.service';

describe('FiroRpcService', () => {
  let service: FiroRpcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [FiroRpcService],
    }).compile();

    service = module.get<FiroRpcService>(FiroRpcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
