import { HttpModule } from '@nestjs/axios';
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
  // beforeAll(async () => {});

  it(`/POST requestAsset Native`, async () => {
    // jest.spyOn(model, 'findOne').mockReturnValue({
    //   exec: jest.fn().mockResolvedValueOnce(mockAsset.native),
    // } as any);
    // return request(app.getHttpServer())
    //   .post('/requests')
    //   .send(dataNative)
    //   .then((res) => {
    //     expect(res.status).toEqual(HttpStatus.OK);
    //     expect(res.body.tx).toEqual(txNative);
    //   });
  });

  it(`/POST requestAsset Token`, async () => {
    // jest.spyOn(model, 'findOne').mockReturnValue({
    //   exec: jest.fn().mockResolvedValueOnce(mockAsset.token),
    // } as any);
    // return request(app.getHttpServer())
    //   .post('/requests')
    //   .send(dataToken)
    //   .then((res) => {
    //     expect(res.status).toEqual(HttpStatus.OK);
    //     expect(res.body.tx).toEqual(txToken);
    //   });
  });

  // afterAll(async () => {});
});
