import { CacheModule, HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import * as request from 'supertest';
import { AisService } from '../../src/ais/ais.service';

import { assetsProviders } from '../../src/assets/assets.providers';
import { Asset } from '../../src/assets/interfaces/asset.interface';
import { FiroRpcService } from '../../src/firo-rpc/firo-rpc.service';
import { RequestsController } from '../../src/requests/requests.controller';
import { RequestsService } from '../../src/requests/requests.service';

describe('Requests', () => {
  let app: INestApplication;
  let model: Model<Asset>;
  const masqueData = {
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
  const txNative = 'txNative';
  const txToken = 'txToken';
  const dataNative = {
    asset: 'native',
    address: '',
  };
  const dataToken = {
    asset: 'token',
    address: 'addr1',
  };
  const mockAsset = {
    native: {
      name: 'asset1',
      balance: 100,
      address: '',
      symbol: 'symbol1',
      logo: 'logo1',
      decimal: 1e18,
    },
    token: {
      name: 'asset2',
      balance: 100,
      address: 'address2',
      symbol: 'symbol2',
      logo: 'logo2',
      decimal: 1e18,
    },
  };

  const databaseProviders = {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.MONGO_URL_TEST),
  };

  const firoRpcService = {
    provide: FiroRpcService,
    useValue: {
      nativeTransfer: jest.fn().mockResolvedValue(txNative),
      tokenTransfer: jest.fn().mockResolvedValue(txToken),
    },
  };

  const aisService = {
    provide: AisService,
    useValue: {
      getAddressFromMasqueId: jest.fn().mockResolvedValue(masqueData),
    },
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), CacheModule.register()],
      controllers: [RequestsController],
      providers: [
        RequestsService,
        ...assetsProviders,
        databaseProviders,
        firoRpcService,
        aisService,
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    model = module.get<Model<Asset>>('ASSET_MODEL');
  });

  it(`/POST requestAsset Native`, async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset.native),
    } as any);

    return request(app.getHttpServer())
      .post('/requests')
      .send(dataNative)
      .then((res) => {
        expect(res.status).toEqual(HttpStatus.OK);
        expect(res.body.tx).toEqual(txNative);
      });
  });

  it(`/POST requestAsset Token`, async () => {
    jest.spyOn(model, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockAsset.token),
    } as any);

    return request(app.getHttpServer())
      .post('/requests')
      .send(dataToken)
      .then((res) => {
        expect(res.status).toEqual(HttpStatus.OK);
        expect(res.body.tx).toEqual(txToken);
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await app.close();
  });
});
