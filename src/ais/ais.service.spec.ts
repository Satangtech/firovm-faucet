import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AisService } from './ais.service';

describe('AisService', () => {
  let service: AisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule, CacheModule.register()],
      providers: [AisService],
    }).compile();

    service = module.get<AisService>(AisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get AIS auth token', async () => {
    const result = {
      access_token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijk5SXYxR25mN3UifQ.eyJpc3MiOiJzcmYuYWlzLmNvLnRoL2FkbWQiLCJzdWIiOiJ0b2tlbl9jbGllbnRfY3JlZGVudGlhbHMiLCJhdWQiOiJHejhwTTU2WTR2KzRDTFl6RFcyZXdsdTNIdTNDRHVDQnAyNnI5NTZEd1RlRHUrU1JWSUZYN3c0NWpWYnA2OU5YIiwiZXhwIjoxNjY5NjE1MDU3LCJpYXQiOjE2Njk2MTE0NTcsImp0aSI6IjhUcXVEY2Vuamk2czVmNGVyWmV5SloiLCJjbGllbnQiOiJPVEF3TURBd01EQXdNREF3TmpZMkxIZGhiR3hsZEhObGNuWnBZMlY4UW1GamEyVnVaSHd4TGpBdU1BPT0iLCJzc2lkIjoiajE1QUQ2OTNFM2ZLbU9oNjIyVmV0OSJ9.El0LZtLAElXjZ1CPMiZDUaPNU6hc47d_SmjzNguTo146hBmVWEejFFa4MjtZpNTEqtAGG96Rj_NwOA1O0DeG0yi3LyUaS7sNb_-k8z7m8MgexvlzAklmPzb4ti7Je_RZpuol6sZHwvhW4_dWkITetO49L3XPJlhHAl_dwJJLImA',
      token_type: 'bearer',
      expires_in: 3600,
    };
    jest
      .spyOn(service, 'getAisAuthToken')
      .mockImplementation(async () => result);
    expect(await service.getAisAuthToken()).toBe(result);
  });

  it('should get address from masque id', async () => {
    const result = {
      resultCode: '20000',
      resultDescription: 'Success',
      data: {
        individualId: 'ais_idp_name:test001',
        accountAddress: 'TKijwvuy2shFcKtdTsjvXjCB9fqrbJqdFK',
        status: 'Active',
        description: '10Set',
        masqueId: 'test001',
        name: 'test001',
        requestId: '637b38afd498ac2c2d286ec0',
        thumbnail:
          'https://masque-dev.adldigitalservice.com/api/v3/masque/Image/637b38afd498ac2c2d286ec0/png',
        displayPic:
          'https://masque-dev.adldigitalservice.com/api/v3/masque/Image/637b38afd498ac2c2d286ec0/display',
        gltf: 'https://masque-dev.adldigitalservice.com/api/v3/masque/Image/637b38afd498ac2c2d286ec0/gltf',
        link: 'https://masque-dev.adldigitalservice.com/public/view/637b38afd498ac2c2d286ec0',
      },
    };
    jest
      .spyOn(service, 'getAddressFromMasqueId')
      .mockImplementation(async () => result);
    expect(await service.getAddressFromMasqueId('test001')).toBe(result);
  });
});
