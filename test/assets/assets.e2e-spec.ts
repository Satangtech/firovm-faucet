import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import mongoose, { Model } from 'mongoose';
import * as request from 'supertest';

import { AssetsController } from '../../src/assets/assets.controller';
import { assetsProviders } from '../../src/assets/assets.providers';
import { AssetsService } from '../../src/assets/assets.service';
import { Asset } from '../../src/assets/interfaces/asset.interface';

describe('Assets', () => {
  let app: INestApplication;
  let model: Model<Asset>;
  const asset = {
    name: 'Name',
    address: 'addr1',
    symbol: 'sym1',
    logo: 'logo1',
    decimal: 1e18,
  };

  const databaseProviders = {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect('mongodb://mongo/faucet-test'),
  };

  beforeAll(async () => {
    const moduleAsset = await Test.createTestingModule({
      controllers: [AssetsController],
      providers: [AssetsService, ...assetsProviders, databaseProviders],
    }).compile();

    app = moduleAsset.createNestApplication();
    await app.init();
    model = moduleAsset.get<Model<Asset>>('ASSET_MODEL');
  });

  it(`/POST assets`, async () => {
    return request(app.getHttpServer())
      .post('/assets')
      .send(asset)
      .then((res) => {
        expect(res.status).toEqual(HttpStatus.CREATED);
        expect(res.body.name).toEqual(asset.name);
        expect(res.body.balance).toBeGreaterThanOrEqual(0);
        expect(res.body.address).toEqual(asset.address);
        expect(res.body.symbol).toEqual(asset.symbol);
        expect(res.body.logo).toEqual(asset.logo);
        expect(res.body.decimal).toEqual(asset.decimal);
        expect(res.body._id).toBeDefined();
      });
  });

  it(`/GET assets`, () => {
    return request(app.getHttpServer())
      .get('/assets')
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.length).toBeGreaterThanOrEqual(1);
      });
  });

  it(`/GET assets/:id`, async () => {
    const asset = await model.findOne({ name: 'Name' }).exec();
    return request(app.getHttpServer())
      .get(`/assets/${asset._id.toString()}`)
      .expect(HttpStatus.OK)
      .then((res) => {
        expect(res.body.name).toEqual(asset.name);
        expect(res.body.balance).toBeGreaterThanOrEqual(0);
        expect(res.body.address).toEqual(asset.address);
        expect(res.body.symbol).toEqual(asset.symbol);
        expect(res.body.logo).toEqual(asset.logo);
        expect(res.body.decimal).toEqual(asset.decimal);
      });
  });

  it(`Patch assets/:id`, async () => {
    const asset = await model.findOne({ name: 'Name' }).exec();
    const address = 'newAddress';
    const logo = 'newLogo';

    return request(app.getHttpServer())
      .patch(`/assets/${asset._id.toString()}`)
      .send({ address, logo })
      .expect(HttpStatus.OK)
      .then(async (res) => {
        expect(res.body.logo).toEqual(logo);
        expect(res.body.address).toEqual(address);
      });
  });

  it(`Delete assets/:id`, async () => {
    const asset = await model.findOne({ name: 'Name' }).exec();
    return request(app.getHttpServer())
      .delete(`/assets/${asset._id.toString()}`)
      .expect(HttpStatus.OK)
      .then(async (res) => {
        expect(res.body.name).toEqual(asset.name);
        expect(res.body.balance).toBeGreaterThanOrEqual(0);
        expect(res.body.address).toEqual(asset.address);
        expect(res.body.symbol).toEqual(asset.symbol);
        expect(res.body.logo).toEqual(asset.logo);
        expect(res.body.decimal).toEqual(asset.decimal);
        expect(await model.findOne({ name: 'Name' }).exec()).toBeNull();
      });
  });

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await app.close();
  });
});
